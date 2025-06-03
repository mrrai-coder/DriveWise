import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

# Set paths
DATA_PATH = os.path.join(os.getcwd(), "data", "FYP_dataset.csv")
MODEL_PATH = os.path.join(os.getcwd(), "models", "random_forest_model.pkl")
ENCODER_PATH = os.path.join(os.getcwd(), "models", "car_name_label_encoder.pkl")

# Create directories if they don't exist
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

# Load the dataset
try:
    df = pd.read_csv(DATA_PATH)
    print("Dataset loaded successfully!")
except FileNotFoundError:
    print(f"Error: {DATA_PATH} not found. Please ensure modified_dataset.csv is in the data/ directory.")
    exit(1)

# Define features (X) and target (y)
X = df.drop(columns=['Car Name'])
y = df['Car Name']

# Perform train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print("Training set size:", X_train.shape)
print("Test set size:", X_test.shape)

# Initialize the label encoder
label_encoder = LabelEncoder()

# Encode categorical columns in X
categorical_columns = ['Engine Type', 'Assembly', 'Body Type', 'Transmission Type', 'Registration Status']
for col in categorical_columns:
    X_train[col] = label_encoder.fit_transform(X_train[col])
    X_test[col] = label_encoder.transform(X_test[col])

# Encode the target variable (Car Name)
y_train = label_encoder.fit_transform(y_train)
y_test = label_encoder.transform(y_test)

# Train the Random Forest model
model = RandomForestClassifier(n_estimators=50, max_depth=50, min_samples_split=16, random_state=100)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Random Forest Accuracy: {accuracy:.4f}")

# Save the model and label encoder
joblib.dump(model, MODEL_PATH)
joblib.dump(label_encoder, ENCODER_PATH)
print(f"Model saved to {MODEL_PATH}")
print(f"Label encoder saved to {ENCODER_PATH}")