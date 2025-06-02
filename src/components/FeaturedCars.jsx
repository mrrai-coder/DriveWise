"use client"

// src/components/FeaturedCars.jsx
import { useNavigate } from "react-router-dom"
import toyota_2021 from "../images/assets/toyota_2021.png"
import civic_2022 from "../images/assets/Civic_2022.png"
import suzuki_swift_2020 from "../images/assets/Suzuki_swift_2020.png"

const FeaturedCars = ({ navigate }) => {
  const reactNavigate = useNavigate()

  const featuredCars = [
    {
      id: 1,
      name: "Toyota Corolla 2021",
      location: "Lahore, Pakistan",
      price: 1300000,
      year: 2021,
      mileage: 15000,
      fuel: "Petrol",
      transmission: "Automatic",
      postedDays: 2,
      image: toyota_2021,
    },
    {
      id: 2,
      name: "Honda Civic 2022",
      location: "Karachi, Pakistan",
      price: 1400000,
      year: 2022,
      mileage: 10000,
      fuel: "Petrol",
      transmission: "Automatic",
      postedDays: 1,
      image: civic_2022,
    },
    {
      id: 3,
      name: "Suzuki Swift 2020",
      location: "Islamabad, Pakistan",
      price: 1100000,
      year: 2020,
      mileage: 20000,
      fuel: "Petrol",
      transmission: "Manual",
      postedDays: 3,
      image: suzuki_swift_2020,
    },
  ]

  const handleViewAll = (e) => {
    e.preventDefault()
    reactNavigate("/all-cars")
    if (navigate) {
      navigate("all-cars")
    }
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
          {featuredCars.map((car) => (
            <div key={car.id} className="car-card">
              <div className="car-image-container">
                <img src={car.image || "/placeholder.svg"} alt={car.name} className="car-image" />
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
                    <span className="spec-value">{car.mileage} km</span>
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
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCars
