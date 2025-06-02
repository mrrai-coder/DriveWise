"use client"

import { useState } from "react"
import axios from "axios"
import Toast from "./Toast"
import "./AuthForms.css" // Updated CSS import

const ListCarForm = ({ isOpen, onClose, onCarListed }) => {
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
    description: "",
    images: [],
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastOpen, setToastOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: files ? Array.from(files) : value,
    })
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Car name is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.price) newErrors.price = "Price is required"
    else if (isNaN(formData.price) || formData.price <= 0) newErrors.price = "Price must be a positive number"
    if (!formData.year) newErrors.year = "Year is required"
    else if (isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear() + 1)
      newErrors.year = "Invalid year"
    if (!formData.mileage) newErrors.mileage = "Mileage is required"
    else if (isNaN(formData.mileage) || formData.mileage < 0) newErrors.mileage = "Mileage cannot be negative"
    if (!formData.fuel) newErrors.fuel = "Fuel type is required"
    if (!formData.transmission) newErrors.transmission = "Transmission is required"
    if (!formData.make.trim()) newErrors.make = "Make is required"
    if (!formData.model.trim()) newErrors.model = "Model is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (formData.images.length === 0) newErrors.images = "At least one image is required"

    return newErrors
  }

  const resetForm = () => {
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
      description: "",
      images: [],
    })
    setErrors({})
    document.getElementById("images").value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      const formDataToSend = new FormData()
      for (const key in formData) {
        if (key === "images") {
          formData.images.forEach((image) => {
            formDataToSend.append(`images`, image)
          })
        } else {
          formDataToSend.append(key, formData[key])
        }
      }

      try {
        const token = localStorage.getItem("token")
        const response = await axios.post("http://localhost:5000/list-car", formDataToSend, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        setToastMessage("Car listed successfully!")
        setToastOpen(true)
        setIsSubmitting(false)
        onCarListed(response.data.carId)
        setTimeout(() => {
          setToastOpen(false)
          resetForm()
          onClose()
        }, 3000)
      } catch (error) {
        setIsSubmitting(false)
        setErrors(
          error.response && error.response.data.errors
            ? error.response.data.errors
            : { general: "An error occurred. Please try again." }
        )
      }
    } else {
      setErrors(newErrors)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>List Your Car</h2>
            <button className="close-btn" onClick={onClose} aria-label="Close">
              <i className="fa fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Car Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="make">Make</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className={errors.make ? "error" : ""}
                />
                {errors.make && <span className="error-message">{errors.make}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={errors.model ? "error" : ""}
                />
                {errors.model && <span className="error-message">{errors.model}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={errors.location ? "error" : ""}
                />
                {errors.location && <span className="error-message">{errors.location}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (PKR)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? "error" : ""}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={errors.year ? "error" : ""}
                />
                {errors.year && <span className="error-message">{errors.year}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="mileage">Mileage (km)</label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className={errors.mileage ? "error" : ""}
                />
                {errors.mileage && <span className="error-message">{errors.mileage}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="fuel">Fuel Type</label>
                <select
                  id="fuel"
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className={errors.fuel ? "error form-select" : "form-select"}
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
                {errors.fuel && <span className="error-message">{errors.fuel}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="transmission">Transmission</label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className={errors.transmission ? "error form-select" : "form-select"}
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
                {errors.transmission && <span className="error-message">{errors.transmission}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={errors.description ? "error" : ""}
                  rows="4"
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="images">Car Images (Select multiple)</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/png,image/jpeg"
                  multiple
                  onChange={handleChange}
                  className={errors.images ? "error" : ""}
                />
                {errors.images && <span className="error-message">{errors.images}</span>}
              </div>

              {errors.general && <span className="error-message">{errors.general}</span>}

              <div className="form-group">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? <i className="fa fa-spinner fa-spin"></i> : "List Car"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast message={toastMessage} isOpen={toastOpen} onClose={() => setToastOpen(false)} />
    </>
  )
}

export default ListCarForm