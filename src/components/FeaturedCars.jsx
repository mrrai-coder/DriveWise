import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const FeaturedCars = () => {
  const navigate = useNavigate()
  const [featuredCars, setFeaturedCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await axios.get("${BASE_URL}/api/cars?featured=true&limit=6")
        setFeaturedCars(response.data.cars)
        setLoading(false)
      } catch (err) {
        setError("Failed to load featured cars. Please try again.")
        setLoading(false)
      }
    }
    fetchFeaturedCars()
  }, [])

  const handleViewAll = (e) => {
    e.preventDefault()
    navigate("/all-cars")
  }

  const handleCarClick = (carId) => {
    navigate(`/cars/${carId}`)
  }

  if (loading) {
    return (
      <section className="featured-cars-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Cars</h2>
          </div>
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="featured-cars-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Cars</h2>
          </div>
          <p style={{ color: "#ef4444", textAlign: "center" }}>{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="featured-cars-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Cars</h2>
          <a href="#" className="view-all" onClick={handleViewAll}>
            View all <i className="fa fa-chevron-right"></i>
          </a>
        </div>

        <div className="car-grid">
          {featuredCars.length > 0 ? (
            featuredCars.map((car) => {
              const imageUrl =
                car.images && car.images.length > 0
                  ? car.images[0].startsWith("/uploads")
                    ? `${}${car.images[0]}`
                    : car.images[0]
                  : "https://via.placeholder.com/300x200"

              return (
                <div
                  key={car._id}
                  className="car-card"
                  onClick={() => handleCarClick(car._id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="car-image-container">
                    <img
                      src={imageUrl}
                      alt={car.name}
                      className="car-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200"
                      }}
                    />
                    <div className="featured-tag">Featured</div>
                  </div>
                  <div className="car-details">
                    <h3 className="car-title">{car.name}</h3>
                    <p className="car-location">{car.location}</p>
                    <div className="car-price-row">
                      <span className="car-price">PKR {car.price.toLocaleString()}</span>
                      <span className="car-posted">Posted {car.postedDays} days ago</span>
                    </div>
                    <div className="car-specs">
                      <div className="car-spec">
                        <span className="spec-label">Year:</span>
                        <span className="spec-value">{car.year}</span>
                      </div>
                      <div className="car-spec">
                        <span className="spec-label">Mileage:</span>
                        <span className="spec-value">{car.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="car-spec">
                        <span className="spec-label">Fuel:</span>
                        <span className="spec-value">{car.fuel}</span>
                      </div>
                      <div className="car-spec">
                        <span className="spec-label">Transmission:</span>
                        <span className="spec-value">{car.transmission}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{ textAlign: "center" }}>No featured cars available.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCars