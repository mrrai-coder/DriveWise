import "./AuthForms.css"

const Toast = ({ message, isOpen, onClose }) => {
  if (!isOpen || !message) return null

  return (
    <div className="toast-overlay">
      <div className="toast-container">
        <div className="toast-message">{message}</div>
        <button className="close-btn" onClick={onClose}>
          <i className="fa fa-times"></i>
        </button>
      </div>
    </div>
  )
}

export default Toast