from flask import Flask, request, jsonify, send_from_directory
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

# Load the Random Forest model and label encoder
MODEL_PATH = os.path.join(os.getcwd(), "models", "random_forest_model.pkl")
ENCODER_PATH = os.path.join(os.getcwd(), "models", "car_name_label_encoder.pkl")
try:
    model = joblib.load(MODEL_PATH)
    car_name_encoder = joblib.load(ENCODER_PATH)
except FileNotFoundError:
    print(f"Error: Model or encoder file not found at {MODEL_PATH} or {ENCODER_PATH}")
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

# Serve uploaded images
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Signup endpoint
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not email or not password:
        return jsonify({"error": "Full name, email, and password are required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user = {"fullName": full_name, "email": email, "password": hashed_password}
    users_collection.insert_one(user)

    return jsonify({"message": "User registered successfully"}), 201

# Login endpoint
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = users_collection.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({"token": access_token, "message": "Login successful"}), 200

# List car endpoint
@app.route("/api/list-car", methods=["POST"])
@jwt_required()
def list_car():
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
    return jsonify({"message": "Car listed successfully", "car": parse_json(car)}), 201

# Get all cars endpoint
@app.route("/api/cars", methods=["GET"])
def get_cars():
    query = {}
    if request.args.get("featured") == "true":
        query["featured"] = True
    cars = list(cars_collection.find(query))
    return jsonify(parse_json(cars)), 200

# Get category counts endpoint
@app.route("/api/categories", methods=["GET"])
def get_category_counts():
    try:
        pipeline = [
            {"$group": {"_id": "$category", "count": {"$sum": 1}}},
            {"$project": {"name": "$_id", "count": 1, "_id": 0}}
        ]
        counts = list(cars_collection.aggregate(pipeline))
        return jsonify(counts), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get single car by ID endpoint
@app.route("/api/cars/<id>", methods=["GET"])
def get_car(id):
    try:
        print(f"Fetching car with ID: {id}")
        car = cars_collection.find_one({"_id": ObjectId(id)})
        if not car:
            return jsonify({"error": "Car not found"}), 404
        return jsonify(parse_json(car)), 200
    except Exception as e:
        print(f"Error fetching car with ID {id}: {str(e)}")
        return jsonify({"error": "Invalid car ID"}), 400

# Car recommendation endpoint
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Expected input fields
        required_fields = [
            "Price", "Model Year", "Engine Type", "Engine Capacity",
            "Assembly", "Body Type", "Transmission Type", "Registration Status"
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400

        # Validate numeric fields
        numeric_fields = ["Price", "Model Year", "Engine Capacity"]
        for field in numeric_fields:
            try:
                data[field] = float(data[field])
            except (ValueError, TypeError):
                return jsonify({"error": f"{field} must be a number"}), 400

        # Define categorical mappings based on training preprocessing
        categorical_mappings = {
            "Engine Type": ["Petrol", "Diesel", "Hybrid"],
            "Assembly": ["Local", "Imported"],
            "Body Type": ["Hatchback", "Sedan", "SUV", "Cross Over", "Van", "Mini Van"],
            "Transmission Type": ["Manual", "Automatic"],
            "Registration Status": ["Registered", "Un-Registered"]
        }

        # Encode categorical variables
        encoded_data = data.copy()
        for col, categories in categorical_mappings.items():
            try:
                encoded_data[col] = categories.index(data[col])
            except ValueError:
                return jsonify({"error": f"Invalid value for {col}. Expected one of: {categories}"}), 400

        # Create DataFrame for prediction
        input_df = pd.DataFrame([encoded_data], columns=required_fields)

        # Make prediction
        prediction = model.predict(input_df)[0]
        car_name = car_name_encoder.inverse_transform([prediction])[0]

        return jsonify({"car_name": car_name}), 200
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({"error": "Prediction failed. Please try again."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)