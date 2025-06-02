from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import bcrypt
import jwt
from datetime import datetime, timedelta
import re
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["drivewise"]
users_collection = db["users"]
cars_collection = db["cars"]

# JWT Secret Key (use environment variable in production)
SECRET_KEY = "your-secret-key"  # Replace with a secure key

# Email validation regex
EMAIL_REGEX = re.compile(r"^\S+@\S+\.\S+$")

# Middleware to verify JWT token
def verify_token(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded["email"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")
    agree_to_terms = data.get("agreeToTerms")

    # Validation
    errors = {}
    if not first_name or not first_name.strip():
        errors["firstName"] = "First name is required"
    if not last_name or not last_name.strip():
        errors["lastName"] = "Last name is required"
    if not email or not email.strip():
        errors["email"] = "Email is required"
    elif not EMAIL_REGEX.match(email):
        errors["email"] = "Email is invalid"
    if not password:
        errors["password"] = "Password is required"
    elif len(password) < 6:
        errors["password"] = "Password must be at least 6 characters"
    if password != confirm_password:
        errors["confirmPassword"] = "Passwords do not match"
    if not agree_to_terms:
        errors["agreeToTerms"] = "You must agree to the terms and conditions"

    if errors:
        return jsonify({"errors": errors}), 400

    # Check if email already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"errors": {"email": "Email already exists"}}), 400

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # Save user to MongoDB
    user = {
        "firstName": first_name,
        "lastName": last_name,
        "email": email,
        "password": hashed_password,
        "createdAt": datetime.utcnow()
    }
    users_collection.insert_one(user)

    # Generate JWT token
    token = jwt.encode(
        {"email": email, "exp": datetime.utcnow() + timedelta(hours=24)},
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({"message": "Signup successful", "token": token}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Validation
    errors = {}
    if not email or not email.strip():
        errors["email"] = "Email is required"
    elif not EMAIL_REGEX.match(email):
        errors["email"] = "Email is invalid"
    if not password:
        errors["password"] = "Password is required"

    if errors:
        return jsonify({"errors": errors}), 400

    # Find user
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"errors": {"email": "Email not found"}}), 400

    # Verify password
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"errors": {"password": "Incorrect password"}}), 400

    # Generate JWT token
    token = jwt.encode(
        {"email": email, "exp": datetime.utcnow() + timedelta(hours=24)},
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({"message": "Login successful", "token": token}), 200

@app.route("/list-car", methods=["POST"])
def list_car():
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        return jsonify({"errors": {"general": "Authentication required"}}), 401

    email = verify_token(token.split("Bearer ")[1])
    if not email:
        return jsonify({"errors": {"general": "Invalid or expired token"}}), 401

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"errors": {"general": "User not found"}}), 404

    data = request.form
    name = data.get("name")
    location = data.get("location")
    price = data.get("price")
    year = data.get("year")
    mileage = data.get("mileage")
    fuel = data.get("fuel")
    transmission = data.get("transmission")
    make = data.get("make")
    model = data.get("model")
    description = data.get("description")
    images = request.files.getlist("images")

    # Validation
    errors = {}
    if not name or not name.strip():
        errors["name"] = "Car name is required"
    if not location or not location.strip():
        errors["location"] = "Location is required"
    if not price or not price.strip():
        errors["price"] = "Price is required"
    elif not price.isdigit() or int(price) <= 0:
        errors["price"] = "Price must be a positive number"
    if not year or not year.strip():
        errors["year"] = "Year is required"
    elif not year.isdigit() or int(year) < 1900 or int(year) > datetime.now().year:
        errors["year"] = "Invalid year"
    if not mileage or not mileage.strip():
        errors["mileage"] = "Mileage is required"
    elif not mileage.isdigit() or int(mileage) < 0:
        errors["mileage"] = "Mileage must be a non-negative number"
    if not fuel or not fuel.strip():
        errors["fuel"] = "Fuel type is required"
    if not transmission or not transmission.strip():
        errors["transmission"] = "Transmission type is required"
    if not make or not make.strip():
        errors["make"] = "Make is required"
    if not model or not model.strip():
        errors["model"] = "Model is required"
    if not description or not description.strip():
        errors["description"] = "Description is required"
    if not images or len(images) == 0:
        errors["images"] = "At least one image is required"

    if errors:
        return jsonify({"errors": errors}), 400

    # Handle multiple image uploads
    image_data_list = []
    for image in images:
        image_data = base64.b64encode(image.read()).decode("utf-8")
        image_type = image.content_type
        image_data_list.append(f"data:{image_type};base64,{image_data}")

    # Save car to MongoDB
    car = {
        "name": name,
        "location": location,
        "price": int(price),
        "year": int(year),
        "mileage": int(mileage),
        "fuel": fuel,
        "transmission": transmission,
        "make": make,
        "model": model,
        "description": description,
        "images": image_data_list,  # Store list of images
        "image": image_data_list[0] if image_data_list else "",  # Set first image as primary for compatibility
        "userId": str(user["_id"]),
        "postedDays": 0,
        "createdAt": datetime.utcnow(),
        "featured": False
    }
    result = cars_collection.insert_one(car)

    return jsonify({"message": "Car listed successfully", "carId": str(result.inserted_id)}), 201

@app.route("/all-cars", methods=["GET"])
def get_all_cars():
    cars = list(cars_collection.find({}, {"_id": 0, "userId": 0}))
    for car in cars:
        car["id"] = str(car.pop("_id"))
    return jsonify({"cars": cars}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)