"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import SuccessModal from "./SuccessModal"

const LoginForm = ({ isOpen, onClose, openSignup, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
        const response = await axios.post("http://localhost:5000/api/login", {
          email: formData.email,
          password: formData.password,
        })

        localStorage.setItem("token", response.data.token)
        setFormData({ email: "", password: "", rememberMe: false })
        setIsSubmitting(false)
        setShowSuccess(true)
        onLoginSuccess()
      } catch (error) {
        setIsSubmitting(false)
        const errorMessage =
          error.response?.data?.error || "Login failed. Please try again."
        setErrors({ api: errorMessage })
        toast.error(errorMessage, { position: "top-right", autoClose: 3000 })
      }
    } else {
      setErrors(newErrors)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container balanced-form">
          <div className="modal-header">
            <h2>Log In</h2>
            <button className="close-btn" onClick={onClose} aria-label="Close">
              <i className="fa fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            {errors.api && <span className="error-message api-error">{errors.api}</span>}
            <form onSubmit={handleSubmit} className="form-layout">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
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

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <i className="fa fa-spinner fa-spin"></i> : "Log In"}
                </button>
              </div>
            </form>

            <div className="login-link text-center">
              No account? <a href="#" onClick={(e) => { e.preventDefault(); onClose(); openSignup(); }}>Sign Up</a>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Login Successful!"
        message="Welcome back! You're now logged in and ready to explore."
        buttonText="Continue"
        onButtonClick={handleSuccessClose}
      />
    </>
  )
}

export default LoginForm