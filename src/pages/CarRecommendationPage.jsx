"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

const CarRecommendation = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    Price: "",
    "Model Year": "",
    "Engine Type": "",
    "Engine Capacity": "",
    Assembly: "",
    "Body Type": "",
    "Transmission Type": "",
    "Registration Status": "",
  })
  const [recommendation, setRecommendation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Navigation function to pass to components
  const handleNavigation = (page) => {
    if (page === "home") {
      navigate("/")
    } else if (page === "all-cars") {
      navigate("/all-cars")
    } else if (page === "about") {
      navigate("/about")
    } else if (page === "car-recommendation") {
      navigate("/car-recommendation")
    }
    window.scrollTo(0, 0)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setRecommendation(null)
    setLoading(true)

    // Validate numeric fields
    const numericFields = ["Price", "Model Year", "Engine Capacity"]
    for (const field of numericFields) {
      if (!formData[field] || isNaN(formData[field])) {
        setError(`Please enter a valid number for ${field}`)
        setLoading(false)
        return
      }
    }

    // Convert numeric fields to numbers
    const numericFormData = {
      Price: Number.parseFloat(formData.Price),
      "Model Year": Number.parseInt(formData["Model Year"], 10),
      "Engine Capacity": Number.parseFloat(formData["Engine Capacity"]),
      "Engine Type": formData["Engine Type"],
      Assembly: formData.Assembly,
      "Body Type": formData["Body Type"],
      "Transmission Type": formData["Transmission Type"],
      "Registration Status": formData["Registration Status"],
    }

    console.log("Sending data:", numericFormData)

    try {
      // Simulate API call for demo - replace with actual API when ready
      // const response = await axios.post(
      //   "http://localhost:5000/predict",
      //   numericFormData,
      //   {
      //     headers: {
      //       // Authorization: `Bearer ${token}`,
      //     },
      //   }
      // )

      // Simulated recommendation based on form data
      setTimeout(() => {
        const simulatedRecommendations = [
          "Toyota Corolla 2021 - Perfect for your budget and preferences!",
          "Honda Civic 2022 - Great fuel efficiency and reliability!",
          "Suzuki Swift 2020 - Compact and economical choice!",
          "Toyota Yaris 2021 - Ideal city car with modern features!",
          "Honda City 2020 - Spacious sedan with excellent value!",
        ]

        const randomRecommendation =
          simulatedRecommendations[Math.floor(Math.random() * simulatedRecommendations.length)]
        setRecommendation(randomRecommendation)
        setLoading(false)
      }, 2000)
    } catch (err) {
      console.error("Error:", err.response?.data || err.message)
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.")
        navigate("/")
      } else {
        setError(err.response?.data?.error || "Error fetching recommendation. Please try again.")
      }
      setLoading(false)
    }
  }

  return (
    <div className="site-wrapper">
      <Header navigate={handleNavigation} />

      <main>
        {/* Page Header */}
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">Car Recommendation</h1>
            <div className="breadcrumbs">
              <a href="#" onClick={() => navigate("/")}>
                Home
              </a>{" "}
              / Car Recommendation
            </div>
          </div>
        </section>

        {/* Car Recommendation Content */}
        <section className="container" style={{ padding: "3rem 0" }}>
          <h2 className="section-title">Car Recommendation</h2>
          <p className="description">Tell us your preferences, and we'll recommend the perfect car for you!</p>

          <form onSubmit={handleSubmit} className="search-form-container">
            <div className="search-form-grid">
              <div>
                <label htmlFor="Price" className="block">
                  Budget (PKR)
                </label>
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
                <label htmlFor="Model Year" className="block">
                  Model Year
                </label>
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
                <label htmlFor="Engine Type" className="block">
                  Engine Type
                </label>
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
                <label htmlFor="Engine Capacity" className="block">
                  Engine Capacity (cc)
                </label>
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
                <label htmlFor="Assembly" className="block">
                  Assembly
                </label>
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
                <label htmlFor="Body Type" className="block">
                  Body Type
                </label>
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
                <label htmlFor="Transmission Type" className="block">
                  Transmission Type
                </label>
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
                <label htmlFor="Registration Status" className="block">
                  Registration Status
                </label>
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
              <p className="car-title" style={{ fontSize: "1.25rem", color: "var(--primary)", fontWeight: "600" }}>
                {recommendation}
              </p>
            </div>
          )}
          {error && (
            <div className="text-center" style={{ marginTop: "2rem", color: "#ef4444" }}>
              <p>{error}</p>
            </div>
          )}
          <div className="text-center" style={{ marginTop: "2rem" }}>
            <button className="btn btn-outline" onClick={() => handleNavigation("home")}>
              Back to Home
            </button>
          </div>
        </section>
      </main>

      <Footer navigate={handleNavigation} />
    </div>
  )
}

export default CarRecommendation
