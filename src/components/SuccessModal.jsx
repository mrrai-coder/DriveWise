"use client"

import { useEffect } from "react"

const SuccessModal = ({ isOpen, onClose, title, message, buttonText, onButtonClick }) => {
  if (!isOpen) return null

  // Close modal with Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <div className="modal-overlay">
      <div className="success-modal-container">
        <div className="success-modal-content">
          <div className="success-icon">
            <i className="fa fa-check-circle" aria-hidden="true"></i>
          </div>
          <h2 className="success-title">{title}</h2>
          <p className="success-message">{message}</p>
          <button
            className="btn btn-primary success-button"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal