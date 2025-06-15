
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import SuccessModal from "./SuccessModal"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link", { position: "top-right", autoClose: 3000 })
      navigate("/login")
    }
  }, [token, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long"
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)

      try {
        await axios.post("http://localhost:5000/api/reset-password", {
          token,
          newPassword: formData.newPassword,
        })

        setFormData({ newPassword: "", confirmPassword: "" })
        setIsSubmitting(false)
        setShowSuccess(true)
      } catch (error) {
        setIsSubmitting(false)
        const errorMessage =
          error.response?.data?.error || "Failed to reset password. Please try again."
        setErrors({ api: errorMessage })
        toast.error(errorMessage, { position: "top-right", autoClose: 3000 })
      }
    } else {
      setErrors(newErrors)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    navigate("/login")
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container no-scroll-form">
        <div className="modal-header">
          <h2>Reset Password</h2>
        </div>
        <div className="modal-body">
          {errors.api && <span className="error-message api-error">{errors.api}</span>}
          <form onSubmit={handleSubmit} className="form-layout">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={errors.newPassword ? "error" : ""}
                placeholder="Enter new password"
              />
              {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error" : ""}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <i className="fa fa-spinner fa-spin"></i> : "Reset Password"}
              </button>
            </div>
          </form>
          <div className="login-link text-center">
            Back to <a href="/login">Log In</a>
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Password Reset Successful!"
        message="Your password has been reset. You can now log in with your new password."
        buttonText="Go to Login"
        onButtonClick={handleSuccessClose}
      />
    </div>
  )
}

export default ResetPassword
