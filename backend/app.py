from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util, ObjectId
import bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
from dotenv import load_dotenv
import json
import uuid
import joblib
import pandas as pd
import re
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {"origins": "http://localhost:3000"},
    r"/uploads/*": {"origins": "http://localhost:3000"},
    r"/predict": {"origins": "http://localhost:3000"}
})

# MongoDB configuration
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(mongo_uri)
db = client["drivewise"]
users_collection = db["users"]
cars_collection = db["cars"]

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

# Uploads directory configuration
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# React build directory
REACT_BUILD_FOLDER = os.path.join(os.getcwd(), "../client/build")  # Adjust path as needed

# Load the Random Forest model and label encoder
MODEL_PATH = os.path.join(os.getcwd(), "models", "random_forest_model.pkl")
ENCODER_PATH = os.path.join(os.getcwd(), "models", "car_name_label_encoder.pkl")
try:
    model = joblib.load(MODEL_PATH)
    car_name_encoder = joblib.load(ENCODER_PATH)
except FileNotFoundError:
    logger.error(f"Model or encoder file not found at {MODEL_PATH} or {ENCODER_PATH}")
    exit(1)

# Helper functions
def parse_json(data):
    if isinstance(data, list):
        return [parse_json(item) for item in data]
    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            if key == "_id" and isinstance(value, ObjectId):
                result[key] = str(value)
            else:
                result[key] = parse_json(value)
        return result
    return data

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_phone_number(phone):
    pattern = r"^(\+92[0-9]{10}|0[0-9]{10})$"
    return bool(re.match(pattern, phone))

# Serve uploaded images
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    if not os.path.exists(file_path):
        logger.warning(f"Image not found: {filename}")
        return jsonify({"error": "Image not found"}), 404
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Serve React app
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    if path.startswith("api/") or path.startswith("uploads/") or path == "predict":
        return jsonify({"error": "Not found"}), 404
    if os.path.exists(os.path.join(REACT_BUILD_FOLDER, path)):
        return send_from_directory(REACT_BUILD_FOLDER, path)
    if not os.path.exists(os.path.join(REACT_BUILD_FOLDER, "index.html")):
        logger.error(f"React build index.html not found at {REACT_BUILD_FOLDER}")
        return jsonify({"error": "Server misconfigured"}), 500
    return send_file(os.path.join(REACT_BUILD_FOLDER, "index.html"))

# Signup endpoint
@app.route("/api/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        full_name = data.get("fullName")
        email = data.get("email")
        password = data.get("password")
        contact_number = data.get("contactNumber", "")

        if not full_name or not email or not password:
            return jsonify({"error": "Full name, email, and password are required"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "Email already registered"}), 400

        if contact_number and not validate_phone_number(contact_number):
            return jsonify({"error": "Invalid phone number format. Use +923001234567 or 03001234567"}), 400

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        user = {
            "fullName": full_name,
            "email": email,
            "password": hashed_password,
            "contactNumber": contact_number,
            "profilePicture": ""
        }
        users_collection.insert_one(user)
        logger.info(f"User registered: {email}")
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        return jsonify({"error": "Failed to register user"}), 500

# Login endpoint
@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = users_collection.find_one({"email": email})
        if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            logger.warning(f"Failed login attempt for: {email}")
            return jsonify({"error": "Invalid email or password"}), 401

        access_token = create_access_token(identity=email)
        logger.info(f"User logged in: {email}")
        return jsonify({"token": access_token, "message": "Login successful"}), 200
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "Failed to login"}), 500

# List car endpoint
@app.route("/api/list-car", methods=["POST"])
@jwt_required()
def list_car():
    try:
        user_email = get_jwt_identity()

        if not request.form:
            return jsonify({"error": "Form data is required"}), 400

        required_fields = ["name", "location", "price", "year", "mileage", "fuel", "transmission", "category"]
        for field in required_fields:
            if field not in request.form or not request.form[field]:
                return jsonify({"error": f"{field} is required"}), 400

        try:
            price = float(request.form["price"])
            year = int(request.form["year"])
            mileage = int(request.form["mileage"])
        except (ValueError, TypeError):
            return jsonify({"error": "Price, year, and mileage must be numeric"}), 400

        image_urls = []
        if "images" in request.files:
            files = request.files.getlist("images")
            for file in files:
                if file and allowed_file(file.filename):
                    file.seek(0, os.SEEK_END)
                    file_size = file.tell()
                    if file_size > MAX_FILE_SIZE:
                        return jsonify({"error": f"File {file.filename} exceeds 5MB limit"}), 400
                    file.seek(0)
                    filename = f"{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}"
                    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                    file.save(file_path)
                    image_urls.append(f"/uploads/{filename}")
                else:
                    return jsonify({"error": f"Invalid file type for {file.filename}. Allowed: jpg, jpeg, png, gif"}), 400
        else:
            image_urls.append("https://via.placeholder.com/300x200")

        car = {
            "name": request.form["name"],
            "location": request.form["location"],
            "price": price,
            "year": year,
            "mileage": mileage,
            "fuel": request.form["fuel"],
            "transmission": request.form["transmission"],
            "postedDays": 0,
            "images": image_urls,
            "featured": request.form.get("featured", "false").lower() == "true",
            "make": request.form.get("make", ""),
            "model": request.form.get("model", ""),
            "category": request.form["category"],
            "seller_email": user_email
        }

        result = cars_collection.insert_one(car)
        car["_id"] = str(result.inserted_id)
        logger.info(f"Car listed by {user_email}: {car['name']}")
        return jsonify({"message": "Car listed successfully", "car": parse_json(car)}), 201
    except Exception as e:
        logger.error(f"List car error: {str(e)}")
        return jsonify({"error": "Failed to list car"}), 500

# Get all cars endpoint
@app.route("/api/cars", methods=["GET"])
def get_cars():
    try:
        query = {}
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 9))
        skip = (page - 1) * limit

        if request.args.get("featured") == "true":
            query["featured"] = True
        if request.args.get("name"):
            query["name"] = {"$regex": re.escape(request.args.get("name")), "$options": "i"}
        if request.args.get("category"):
            query["category"] = request.args.get("category")
        if request.args.get("minPrice"):
            query["price"] = query.get("price", {})
            query["price"]["$gte"] = float(request.args.get("minPrice"))
        if request.args.get("maxPrice"):
            query["price"] = query.get("price", {})
            query["price"]["$lte"] = float(request.args.get("maxPrice"))

        sort_param = request.args.get("sort", "price-asc")
        sort_field = "price"
        sort_order = 1
        if sort_param == "price-desc":
            sort_order = -1
        elif sort_param == "year-asc":
            sort_field = "year"
        elif sort_param == "year-desc":
            sort_field = "year"
            sort_order = -1

        cars = list(cars_collection.find(query).sort(sort_field, sort_order).skip(skip).limit(limit))
        total_cars = cars_collection.count_documents(query)
        total_pages = (total_cars + limit - 1) // limit

        return jsonify({
            "cars": parse_json(cars),
            "totalCars": total_cars,
            "totalPages": total_pages,
            "currentPage": page
        }), 200
    except (ValueError, TypeError) as e:
        logger.error(f"Invalid query parameters: {str(e)}")
        return jsonify({"error": "Invalid query parameters"}), 400
    except Exception as e:
        logger.error(f"Get cars error: {str(e)}")
        return jsonify({"error": "Failed to fetch cars"}), 500

# Get category counts endpoint
@app.route("/api/categories", methods=["GET"])
def get_category_counts():
    try:
        pipeline = [
            {"$group": {"_id": "$category", "count": {"$sum": 1}}},
            {"$project": {"name": "$_id", "count": 1, "_id": 0}}
        ]
        counts = list(cars_collection.aggregate(pipeline))
        logger.info("Fetched category counts")
        return jsonify(counts), 200
    except Exception as e:
        logger.error(f"Get categories error: {str(e)}")
        return jsonify({"error": "Failed to fetch categories"}), 500

# Get single car by ID endpoint
@app.route("/api/cars/<id>", methods=["GET"])
def get_car(id):
    try:
        car = cars_collection.find_one({"_id": ObjectId(id)})
        if not car:
            logger.warning(f"Car not found: {id}")
            return jsonify({"error": "Car not found"}), 404
        logger.info(f"Fetched car: {id}")
        return jsonify(parse_json(car)), 200
    except Exception as e:
        logger.error(f"Get car error for ID {id}: {str(e)}")
        return jsonify({"error": "Invalid car ID"}), 400

# User profile endpoint
@app.route("/api/user-profile", methods=["GET"])
@jwt_required()
def get_user_profile():
    try:
        user_email = get_jwt_identity()
        user = users_collection.find_one({"email": user_email})
        if not user:
            logger.warning(f"User not found: {user_email}")
            return jsonify({"error": "User not found"}), 404

        user_cars = list(cars_collection.find({"seller_email": user_email}))
        user_data = {
            "fullName": user.get("fullName"),
            "email": user.get("email"),
            "contactNumber": user.get("contactNumber", ""),
            "profilePicture": user.get("profilePicture", ""),
            "cars": parse_json(user_cars)
        }
        logger.info(f"Fetched profile for: {user_email}")
        return jsonify(user_data), 200
    except Exception as e:
        logger.error(f"Get user profile error for {user_email}: {str(e)}")
        return jsonify({"error": "Failed to fetch profile"}), 500

# Update user details endpoint
@app.route("/api/update-user", methods=["PUT"])
@jwt_required()
def update_user():
    try:
        user_email = get_jwt_identity()
        data = request.form
        update_data = {}

        if "contactNumber" in data and data["contactNumber"]:
            if not validate_phone_number(data["contactNumber"]):
                return jsonify({"error": "Invalid phone number format. Use +923001234567 or 03001234567"}), 400
            update_data["contactNumber"] = data["contactNumber"]

        if "fullName" in data and data["fullName"]:
            update_data["fullName"] = data["fullName"]

        if "profilePicture" in request.files:
            file = request.files["profilePicture"]
            if file and allowed_file(file.filename):
                file.seek(0, os.SEEK_END)
                file_size = file.tell()
                if file_size > MAX_FILE_SIZE:
                    return jsonify({"error": "Profile picture exceeds 5MB limit"}), 400
                file.seek(0)
                filename = f"{uuid.uuid4().hex}.{file.filename.rsplit('.', 1)[1].lower()}"
                file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                file.save(file_path)
                update_data["profilePicture"] = f"/uploads/{filename}"

                user = users_collection.find_one({"email": user_email})
                if user.get("profilePicture") and user["profilePicture"].startswith("/uploads/"):
                    old_file = user["profilePicture"].split("/")[-1]
                    old_file_path = os.path.join(app.config["UPLOAD_FOLDER"], old_file)
                    if os.path.exists(old_file_path):
                        os.remove(old_file_path)

        if not update_data:
            return jsonify({"error": "No valid data provided"}), 400

        users_collection.update_one({"email": user_email}, {"$set": update_data})
        logger.info(f"User updated: {user_email}")
        return jsonify({"message": "User details updated successfully"}), 200
    except Exception as e:
        logger.error(f"Update user error for {user_email}: {str(e)}")
        return jsonify({"error": "Failed to update user details"}), 500

# Update car listing endpoint
@app.route('/api/update-car/<id>', methods=['PUT'])
@jwt_required()
def update_car(id):
    try:
        user_email = get_jwt_identity()
        car = cars_collection.find_one({'_id': ObjectId(id), 'seller_email': user_email})
        if not car:
            return jsonify({'error': 'Car not found or not authorized'}), 404

        update_data = {}
        for field in ['name', 'location', 'price', 'year', 'mileage', 'fuel', 'transmission', 'category', 'make', 'model', 'featured']:
            if field in request.form:
                value = request.form[field]
                if field in ['price', 'year', 'mileage']:
                    try:
                        update_data[field] = float(value) if field == 'price' else int(value)
                    except ValueError:
                        return jsonify({'error': f'Invalid {field}'}), 400
                elif field == 'featured':
                    update_data[field] = value.lower() == 'true'
                else:
                    update_data[field] = value

        # Validate category
        valid_categories = ["Sedans", "SUVs", "Hatchbacks", "Luxury Cars", "Electric", "Budget Cars"]
        if 'category' in update_data and update_data['category'] not in valid_categories:
            return jsonify({'error': f'Invalid category. Must be one of: {", ".join(valid_categories)}'}), 400

        # Handle image uploads
        new_images = request.files.getlist('images')
        if new_images:
            # Delete old images
            for image_path in car.get('images', []):
                try:
                    full_path = os.path.join(app.config['UPLOAD_FOLDER'], image_path.lstrip('/uploads/'))
                    if os.path.exists(full_path):
                        os.remove(full_path)
                except Exception as e:
                    app.logger.error(f"Error deleting image {image_path}: {str(e)}")

            update_data['images'] = []
            for image in new_images:
                if image and image.filename:
                    if not image.mimetype in ['image/png', 'image/jpeg', 'image/gif']:
                        return jsonify({'error': f'Invalid image type for {image.filename}'}), 400
                    if image.content_length > 5 * 1024 * 1024:
                        return jsonify({'error': f'Image {image.filename} exceeds 5MB limit'}), 400
                    filename = secure_filename(image.filename)
                    image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                    update_data['images'].append(f'/uploads/{filename}')

        if not update_data:
            return jsonify({'error': 'No valid data provided'}), 400

        cars_collection.update_one({'_id': ObjectId(id)}, {'$set': update_data})
        app.logger.info(f"Car updated: {id} by {user_email}")
        return jsonify({'message': 'Car updated successfully'}), 200
    except ValueError:
        return jsonify({'error': 'Invalid car ID'}), 400
    except Exception as e:
        app.logger.error(f"Update car error for ID {id}: {str(e)}")
        return jsonify({'error': 'Failed to update car'}), 500
# Change password endpoint
@app.route("/api/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    try:
        user_email = get_jwt_identity()
        data = request.get_json()
        current_password = data.get("currentPassword")
        new_password = data.get("newPassword")

        if not current_password or not new_password:
            return jsonify({"error": "Current and new password are required"}), 400

        if len(new_password) < 8:
            return jsonify({"error": "New password must be at least 8 characters long"}), 400

        user = users_collection.find_one({"email": user_email})
        if not user or not bcrypt.checkpw(current_password.encode("utf-8"), user["password"]):
            logger.warning(f"Invalid password change attempt by: {user_email}")
            return jsonify({"error": "Current password is incorrect"}), 401

        hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
        users_collection.update_one({"email": user_email}, {"$set": {"password": hashed_password}})
        logger.info(f"Password changed for: {user_email}")
        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        logger.error(f"Change password error for {user_email}: {str(e)}")
        return jsonify({"error": "Failed to change password"}), 500

# Delete car listing endpoint
@app.route('/api/delete-car/<id>', methods=['DELETE'])
@jwt_required()
def delete_car(id):
    try:
        user_email = get_jwt_identity()
        car = cars_collection.find_one({'_id': ObjectId(id), 'seller_email': user_email})
        if not car:
            return jsonify({'error': 'Car not found or not authorized'}), 404

        # Delete associated images
        for image_path in car.get('images', []):
            try:
                full_path = os.path.join(app.config['UPLOAD_FOLDER'], image_path.lstrip('/uploads/'))
                if os.path.exists(full_path):
                    os.remove(full_path)
            except Exception as e:
                app.logger.error(f"Error deleting image {image_path}: {str(e)}")

        # Delete the car from the database
        cars_collection.delete_one({'_id': ObjectId(id)})
        app.logger.info(f"Car deleted: {id} by {user_email}")
        return jsonify({'message': 'Car deleted successfully'}), 200
    except Exception as e:
        app.logger.error(f"Delete car error for ID {id}: {str(e)}")
        return jsonify({'error': 'Failed to delete car'}), 500
# Delete account endpoint
@app.route("/api/delete-account", methods=["DELETE"])
@jwt_required()
def delete_account():
    try:
        user_email = get_jwt_identity()
        user = users_collection.find_one({"email": user_email})
        if not user:
            logger.warning(f"User not found for deletion: {user_email}")
            return jsonify({"error": "User not found"}), 404

        user_cars = cars_collection.find({"seller_email": user_email})
        for car in user_cars:
            for image_url in car.get("images", []):
                if image_url.startswith("/uploads/"):
                    filename = image_url.split("/")[-1]
                    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                    if os.path.exists(file_path):
                        os.remove(file_path)
        cars_collection.delete_many({"seller_email": user_email})

        if user.get("profilePicture") and user["profilePicture"].startswith("/uploads/"):
            filename = user["profilePicture"].split("/")[-1]
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            if os.path.exists(file_path):
                os.remove(file_path)

        users_collection.delete_one({"email": user_email})
        logger.info(f"Account deleted: {user_email}")
        return jsonify({"message": "Account and associated cars deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Delete account error for {user_email}: {str(e)}")
        return jsonify({"error": "Failed to delete account"}), 500

# Car recommendation endpoint
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        required_fields = [
            "Price", "Model Year", "Engine Type", "Engine Capacity",
            "Assembly", "Body Type", "Transmission Type", "Registration Status"
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400

        numeric_fields = ["Price", "Model Year", "Engine Capacity"]
        for field in numeric_fields:
            try:
                data[field] = float(data[field])
            except (ValueError, TypeError):
                return jsonify({"error": f"{field} must be a number"}), 400

        categorical_mappings = {
            "Engine Type": ["Petrol", "Diesel", "Hybrid"],
            "Assembly": ["Local", "Imported"],
            "Body Type": ["Hatchback", "Sedan", "SUV", "Cross Over", "Van", "Mini Van"],
            "Transmission Type": ["Manual", "Automatic"],
            "Registration Status": ["Registered", "Un-Registered"]
        }

        encoded_data = data.copy()
        for col, categories in categorical_mappings.items():
            try:
                encoded_data[col] = categories.index(data[col])
            except ValueError:
                return jsonify({"error": f"Invalid value for {col}. Expected one of: {categories}"}), 400

        input_df = pd.DataFrame([encoded_data], columns=required_fields)
        prediction = model.predict(input_df)[0]
        car_name = car_name_encoder.inverse_transform([prediction])[0]
        logger.info(f"Prediction made: {car_name}")
        return jsonify({"car_name": car_name}), 200
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": "Prediction failed. Please try again."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)