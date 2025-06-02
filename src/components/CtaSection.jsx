import { useNavigate } from "react-router-dom"
import bg_img from "../images/Cta/Cta-background-img.png"

const CtaSection = () => {
  const navigate = useNavigate()

  const handleBrowseCars = (e) => {
    e.preventDefault()
    navigate("/all-cars")
  }

  return (
    <section
      className="cta-section"
      style={{
        backgroundImage: `url(${bg_img})`,
      }}
    >
      <div className="cta-overlay"></div>
      <div className="container text-center">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Buy or Sell Your Car?</h2>
          <p className="cta-description">
            Join thousands of satisfied customers who have bought and sold cars on Drive Wise.
          </p>
          <div className="cta-buttons">
            <button onClick={handleBrowseCars} className="btn btn-outline">
              Browse Cars
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection