"use client"

import { useState } from "react"
import axios from "axios"
import Toast from "./Toast"
import "./AuthForms.css"

const LoginForm = ({ isOpen, onClose, openSignup, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastOpen, setToastOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      try {
        const response = await axios.post("http://localhost:5000/login", {
          email: formData.email,
          password: formData.password,
        })
        localStorage.setItem("token", response.data.token)
        console.log("Login successful, showing toast: Successfully logged in")
        setToastMessage("Successfully logged in")
        setToastOpen(true)
        setIsSubmitting(false)
        setErrors({})
        onLoginSuccess()
        setTimeout(() => {
          console.log("Closing toast and form")
          setToastOpen(false)
          onClose()
          setFormData({
            email: "",
            password: "",
            rememberMe: false,
          })
        }, 3000)
      } catch (error) {
        setIsSubmitting(false)
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors)
        } else {
          setErrors({ general: "An error occurred. Please try again." })
        }
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
            <h2>Log In to Your Account</h2>
            <button className="close-btn" onClick={onClose}>
              <i className="fa fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group remember-forgot">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              {errors.general && <span className="error-message">{errors.general}</span>}

              <div className="form-group">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? <i className="fa fa-spinner fa-spin"></i> : "Log In"}
                </button>
              </div>
            </form>

            <div className="login-link">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onClose()
                  openSignup()
                }}
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toastMessage} isOpen={toastOpen} onClose={() => setToastOpen(false)} />
    </>
  )
}

export default LoginForm