"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const SellCar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleNavigation = (page) => {
    if (page === "home") {
      navigate("/");
    } else if (page === "all-cars") {
      navigate("/all-cars");
    } else if (page === "about") {
      navigate("/about");
    } else if (page === "sell-car") {
      navigate("/sell-car");
    }
    window.scrollTo(0, 0);
  };

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
    const files = Array.from(e.target.files).slice(0, 5);
    if (files.length === 0) {
      setError("Please select at least one image");
      setImageFiles([]);
      setImagePreviews([]);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024;
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setError("Please upload valid images (JPEG, PNG, or GIF)");
        setImageFiles([]);
        setImagePreviews([]);
        return;
      }
      if (file.size > maxSize) {
        setError(`Image ${file.name} exceeds 5MB limit`);
        setImageFiles([]);
        setImagePreviews([]);
        return;
      }
    }

    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    setError("");
    setSuccess("");
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

    // Validate images
    if (imageFiles.length === 0) {
      setError("At least one image is required");
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      const response = await axios.post("http://localhost:5000/api/list-car", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(response.data.message || "Car listed successfully! Your listing is now live.");
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
      setImageFiles([]);
      setImagePreviews([]);
      document.getElementById("images").value = "";
    } catch (err) {
      setError(err.response?.data?.error || "Failed to list car. Please try again.");
    }
  };

  return (
    <div className="site-wrapper">
      <Header navigate={handleNavigation} />
      <main>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">Sell Car</h1>
            <div className="breadcrumbs">
              <a href="#" onClick={() => navigate("/")}>
                Home
              </a>{" "}
              / Sell Car
            </div>
          </div>
        </section>
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
                <label htmlFor="images" className="block">
                  Car Images (Up to 5, at least 1 required)
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/jpeg,image/png,image/gif"
                  multiple
                  onChange={handleImageChange}
                  className="form-select"
                />
                {imagePreviews.length > 0 && (
                  <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                    {imagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          borderRadius: "4px",
                          objectFit: "cover",
                        }}
                      />
                    ))}
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
      <Footer navigate={handleNavigation} />
    </div>
  );
};

export default SellCar;