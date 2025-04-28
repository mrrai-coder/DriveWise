import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const SellCarPage = ({ navigate }) => {
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    year: "",
    mileage: "",
    fuel: "",
    transmission: "",
    make: "",
    model: "",
    category: "",
    featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect to login if not authenticated
  if (!user || !token) {
    return (
      <div className="site-wrapper">
        <Header navigate={navigate} />
        <main>
          <section className="container" style={{ padding: "3rem 0" }}>
            <h2 className="section-title">Please Log In</h2>
            <p>You must be logged in to list a car for sale.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("home")}
            >
              Go to Home
            </button>
          </section>
        </main>
        <Footer navigate={navigate} />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image (JPEG, PNG, or GIF)");
        setImageFile(null);
        setImagePreview(null);
        return;
      }
      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError("Image size must be less than 5MB");
        setImageFile(null);
        setImagePreview(null);
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate required fields
    const requiredFields = ["name", "location", "price", "year", "mileage", "fuel", "transmission", "category"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return;
      }
    }

    try {
      const data = new FormData();
      // Append form fields
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      // Append image file if selected
      if (imageFile) {
        data.append("image", imageFile);
      }

      const response = await axios.post(
        "http://localhost:5000/api/list-car",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: Don't set Content-Type for FormData; axios sets it automatically
          },
        }
      );

      setSuccess(response.data.message);
      setFormData({
        name: "",
        location: "",
        price: "",
        year: "",
        mileage: "",
        fuel: "",
        transmission: "",
        make: "",
        model: "",
        category: "",
        featured: false,
      });
      setImageFile(null);
      setImagePreview(null);
      // Reset file input
      document.getElementById("image").value = "";
    } catch (err) {
      setError(err.response?.data?.error || "Failed to list car. Please try again.");
    }
  };

  return (
    <div className="site-wrapper">
      <Header navigate={navigate} />
      <main>
        <section className="container" style={{ padding: "3rem 0" }}>
          <h2 className="section-title">Sell Your Car</h2>
          <p className="description">List your car for sale on Drive Wise!</p>
          <form onSubmit={handleSubmit} className="search-form-container">
            <div className="search-form-grid">
              <div>
                <label htmlFor="name" className="block">
                  Car Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-select"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-select"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block">
                  Price (PKR)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-select"
                  required
                  min="100000"
                />
              </div>
              <div>
                <label htmlFor="year" className="block">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-select"
                  required
                  min="1990"
                  max="2025"
                />
              </div>
              <div>
                <label htmlFor="mileage" className="block">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="form-select"
                  required
                  min="0"
                />
              </div>
              <div className="select-wrapper">
                <label htmlFor="fuel" className="block">
                  Fuel Type
                </label>
                <select
                  id="fuel"
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="select-wrapper">
                <label htmlFor="transmission" className="block">
                  Transmission
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label htmlFor="make" className="block">
                  Make
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className="form-select"
                />
              </div>
              <div>
                <label htmlFor="model" className="block">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="form-select"
                />
              </div>
              <div className="select-wrapper">
                <label htmlFor="category" className="block">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Sedans">Sedans</option>
                  <option value="SUVs">SUVs</option>
                  <option value="Hatchbacks">Hatchbacks</option>
                  <option value="Luxury Cars">Luxury Cars</option>
                  <option value="Electric">Electric</option>
                  <option value="Budget Cars">Budget Cars</option>
                </select>
              </div>
              <div>
                <label htmlFor="image" className="block">
                  Car Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageChange}
                  className="form-select"
                />
                {imagePreview && (
                  <div style={{ marginTop: "1rem" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="featured" className="block">
                  Mark as Featured
                </label>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="form-checkbox"
                />
              </div>
            </div>
            <div className="text-center" style={{ marginTop: "1.5rem" }}>
              <button type="submit" className="btn btn-primary">
                List Car
              </button>
            </div>
          </form>
          {error && (
            <div className="text-center" style={{ marginTop: "2rem", color: "#ef4444" }}>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="text-center" style={{ marginTop: "2rem", color: "#10b981" }}>
              <p>{success}</p>
            </div>
          )}
        </section>
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

export default SellCarPage;