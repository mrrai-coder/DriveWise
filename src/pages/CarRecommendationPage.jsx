import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const CarRecommendationPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Price: "",
    "Model Year": "",
    "Engine Type": "",
    "Engine Capacity": "",
    Assembly: "",
    "Body Type": "",
    "Transmission Type": "",
    "Registration Status": "",
  });
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setRecommendation(null);
    setLoading(true);

    // Validate numeric fields
    const numericFields = ["Price", "Model Year", "Engine Capacity"];
    for (const field of numericFields) {
      if (!formData[field] || isNaN(formData[field])) {
        setError(`Please enter a valid number for ${field}`);
        setLoading(false);
        return;
      }
    }

    // Convert numeric fields to numbers
    const numericFormData = {
      Price: parseFloat(formData.Price),
      "Model Year": parseInt(formData["Model Year"], 10),
      "Engine Capacity": parseFloat(formData["Engine Capacity"]),
      "Engine Type": formData["Engine Type"],
      Assembly: formData.Assembly,
      "Body Type": formData["Body Type"],
      "Transmission Type": formData["Transmission Type"],
      "Registration Status": formData["Registration Status"],
    };

    console.log("Sending data:", numericFormData);

    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        numericFormData,
        {
          headers: {
            // Uncomment if /predict requires authentication
            // Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);
      setRecommendation(response.data.car_name);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigate("/"); // Updated to navigate to root route
      } else {
        setError(err.response?.data?.error || "Error fetching recommendation. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-wrapper">
      <Header navigate={navigate} />
      <main>
        <section className="container" style={{ padding: "3rem 0" }}>
          <h2 className="section-title">Car Recommendation</h2>
          <p className="description">Tell us your preferences, and we'll recommend the perfect car for you!</p>
          <form onSubmit={handleSubmit} className="search-form-container">
            <div className="search-form-grid">
              <div>
                <label htmlFor="Price" className="block">Budget (PKR)</label>
                <input
                  type="number"
                  id="Price"
                  name="Price"
                  value={formData.Price}
                  onChange={handleChange}
                  className="form-select"
                  required
                  min="100000"
                  max="50000000"
                />
              </div>
              <div>
                <label htmlFor="Model Year" className="block">Model Year</label>
                <input
                  type="number"
                  id="Model Year"
                  name="Model Year"
                  value={formData["Model Year"]}
                  onChange={handleChange}
                  className="form-select"
                  required
                  min="1990"
                  max="2025"
                />
              </div>
              <div className="select-wrapper">
                <label htmlFor="Engine Type" className="block">Engine Type</label>
                <select
                  id="Engine Type"
                  name="Engine Type"
                  value={formData["Engine Type"]}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Engine Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label htmlFor="Engine Capacity" className="block">Engine Capacity (cc)</label>
                <input
                  type="number"
                  id="Engine Capacity"
                  name="Engine Capacity"
                  value={formData["Engine Capacity"]}
                  onChange={handleChange}
                  className="form-select"
                  required
                  min="660"
                  max="4608"
                />
              </div>
              <div className="select-wrapper">
                <label htmlFor="Assembly" className="block">Assembly</label>
                <select
                  id="Assembly"
                  name="Assembly"
                  value={formData.Assembly}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Assembly</option>
                  <option value="Local">Local</option>
                  <option value="Imported">Imported</option>
                </select>
              </div>
              <div className="select-wrapper">
                <label htmlFor="Body Type" className="block">Body Type</label>
                <select
                  id="Body Type"
                  name="Body Type"
                  value={formData["Body Type"]}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Body Type</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Cross Over">Cross Over</option>
                  <option value="Van">Van</option>
                  <option value="Mini Van">Mini Van</option>
                </select>
              </div>
              <div className="select-wrapper">
                <label htmlFor="Transmission Type" className="block">Transmission Type</label>
                <select
                  id="Transmission Type"
                  name="Transmission Type"
                  value={formData["Transmission Type"]}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div className="select-wrapper">
                <label htmlFor="Registration Status" className="block">Registration Status</label>
                <select
                  id="Registration Status"
                  name="Registration Status"
                  value={formData["Registration Status"]}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Registered">Registered</option>
                  <option value="Un-Registered">Un-Registered</option>
                </select>
              </div>
            </div>
            <div className="text-center" style={{ marginTop: "1.5rem" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Loading..." : "Get Recommendation"}
              </button>
            </div>
          </form>
          {recommendation && (
            <div className="text-center" style={{ marginTop: "2rem" }}>
              <h3 className="section-title">Recommended Car</h3>
              <p className="car-title">{recommendation}</p>
            </div>
          )}
          {error && (
            <div className="text-center" style={{ marginTop: "2rem", color: "#ef4444" }}>
              <p>{error}</p>
            </div>
          )}
          <div className="text-center" style={{ marginTop: "2rem" }}>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/")} // Updated to navigate to root route
            >
              Back to Home
            </button>
          </div>
        </section>
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

export default CarRecommendationPage;