"use client"

import { useState } from "react"
import axios from "axios"
import Toast from "./Toast"
import Header from "./Header"
import Footer from "./Footer"
import "./AuthForms.css"

const CarRecommendation = () => {
  console.log("CarRecommendation component rendering")
  const [formData, setFormData] = useState({
    fuelType: "",
    engineType: "",
    budget: "",
  })
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastOpen, setToastOpen] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.fuelType) {
      newErrors.fuelType = "Fuel type is required"
    }
    if (!formData.engineType) {
      newErrors.engineType = "Engine type is required"
    }
    if (!formData.budget) {
      newErrors.budget = "Budget is required"
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form submitted with data:", formData)
    const newErrors = validate()

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.log("No token found, redirecting to login")
          setErrors({ general: "Please log in to get recommendations." })
          return
        }
        console.log("Sending request to /recommend with token:", token)
        const response = await axios.post(
          "http://localhost:5000/recommend",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setRecommendations(response.data.cars)
        console.log("Recommendations received:", response.data.cars)
        setToastMessage("Recommendations fetched successfully")
        setToastOpen(true)
        setIsLoading(false)
        setErrors({})
        setTimeout(() => {
          console.log("Closing toast")
          setToastOpen(false)
          setToastMessage("")
        }, 4000)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        setIsLoading(false)
        if (error.response && error.response.data.message) {
          setErrors({ general: error.response.data.message })
        } else {
          setErrors({ general: "An error occurred. Please try again." })
        }
      }
    } else {
      console.log("Validation errors:", newErrors)
      setErrors(newErrors)
    }
  }

  return (
    <div className="app-container">
      <Header />
      <main className="recommendation-page">
        <div className="container">
          <h2>Car Recommendation</h2>
          <form onSubmit={handleSubmit} className="recommendation-form">
            <div className="form-group">
              <label htmlFor="fuelType">Fuel Type</label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className={errors.fuelType ? "error" : ""}
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              {errors.fuelType && <span className="error-message">{errors.fuelType}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="engineType">Engine Type</label>
              <select
                id="engineType"
                name="engineType"
                value={formData.engineType}
                onChange={handleChange}
                className={errors.engineType ? "error" : ""}
              >
                <option value="">Select Engine Type</option>
                <option value="Inline">Inline</option>
                <option value="V-Type">V-Type</option>
                <option value="Electric">Electric</option>
              </select>
              {errors.engineType && <span className="error-message">{errors.engineType}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget (PKR)</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={errors.budget ? "error" : ""}
              >
                <option value="">Select Budget</option>
                <option value="1000000-2000000">1M - 2M</option>
                <option value="2000000-3000000">2M - 3M</option>
                <option value="3000000-5000000">3M - 5M</option>
                <option value="5000000+">Above 5M</option>
              </select>
              {errors.budget && <span className="error-message">{errors.budget}</span>}
            </div>

            {errors.general && <span className="error-message">{errors.general}</span>}

            <div className="form-group">
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <i className="fa fa-spinner fa-spin"></i> : "Get Car Recommendation"}
              </button>
            </div>
          </form>

          {recommendations.length > 0 && (
            <div className="recommendation-results">
              <h3>Recommended Cars</h3>
              <div className="car-grid">
                {recommendations.map((car, index) => (
                  <div key={index} className="car-card">
                    <h4>{car.make} {car.model}</h4>
                    <p>Fuel Type: {car.fuelType}</p>
                    <p>Engine Type: {car.engineType}</p>
                    <p>Price: PKR {car.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Toast message={toastMessage} isOpen={toastOpen} onClose={() => setToastOpen(false)} />
    </div>
  )
}

export default CarRecommendation