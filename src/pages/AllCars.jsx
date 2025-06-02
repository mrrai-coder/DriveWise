"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "../components/Header"
import Footer from "../components/Footer"

const AllCars = ({ onCarListed }) => {
  const navigate = useNavigate()

  const handleNavigation = (page) => {
    if (page === "home") {
      navigate("/")
    } else if (page === "all-cars") {
      navigate("/all-cars")
    } else if (page === "about") {
      navigate("/about")
    } else if (page === "list-car") {
      navigate("/list-car")
    }
    window.scrollTo(0, 0)
  }

  const [filters, setFilters] = useState({
    make: "",
    model: "",
    city: "",
    priceRange: "",
    year: "",
    transmission: "",
  })

  const [sortBy, setSortBy] = useState("newest")
  const [displayedCars, setDisplayedCars] = useState([])
  const [allCars, setAllCars] = useState([])

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:5000/all-cars")
      const cars = response.data.cars.map((car) => ({
        ...car,
        id: car.id || car._id?.toString(),
      }))
      setAllCars(cars)
      setDisplayedCars(cars)
    } catch (error) {
      console.error("Error fetching cars:", error)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  useEffect(() => {
    if (onCarListed) {
      fetchCars()
    }
  }, [onCarListed])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  useEffect(() => {
    let filteredCars = [...allCars]

    if (filters.make) {
      filteredCars = filteredCars.filter((car) => car.make?.toLowerCase() === filters.make.toLowerCase())
    }

    if (filters.model) {
      filteredCars = filteredCars.filter((car) => car.model?.toLowerCase() === filters.model.toLowerCase())
    }

    if (filters.city) {
      filteredCars = filteredCars.filter((car) => car.location?.toLowerCase().includes(filters.city.toLowerCase()))
    }

    if (filters.transmission) {
      filteredCars = filteredCars.filter((car) => car.transmission?.toLowerCase() === filters.transmission.toLowerCase())
    }

    if (filters.year) {
      filteredCars = filteredCars.filter((car) => car.year?.toString() === filters.year)
    }

    switch (sortBy) {
      case "newest":
        filteredCars.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        break
      case "oldest":
        filteredCars.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
        break
      case "price-low":
        filteredCars.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredCars.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setDisplayedCars(filteredCars)
  }, [filters, sortBy, allCars])

  return (
    <div className="site-wrapper">
      <Header navigate={handleNavigation} />

      <main>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">All Cars</h1>
            <div className="breadcrumbs">
              <button
                onClick={() => handleNavigation("home")}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Home
              </button>{" "}
              / <span>All Cars</span>
            </div>
          </div>
        </section>

        <section className="advanced-filters-section">
          <div className="container">
            <div className="filters-container">
              <div className="filters-header">
                <h3>Advanced Filters</h3>
                <div className="sort-container">
                  <label htmlFor="sort-by">Sort by:</label>
                  <select id="sort-by" className="form-select" value={sortBy} onChange={handleSortChange}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="filters-grid">
                <div className="filter-group">
                  <label htmlFor="make">Make</label>
                  <select
                    id="make"
                    name="make"
                    className="form-select"
                    value={filters.make}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Makes</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Suzuki">Suzuki</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="model">Model</label>
                  <select
                    id="model"
                    name="model"
                    className="form-select"
                    value={filters.model}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Models</option>
                    <option value="Corolla">Corolla</option>
                    <option value="Civic">Civic</option>
                    <option value="Swift">Swift</option>
                    <option value="Yaris">Yaris</option>
                    <option value="City">City</option>
                    <option value="Cultus">Cultus</option>
                    <option value="Fortuner">Fortuner</option>
                    <option value="BR-V">BR-V</option>
                    <option value="Alto">Alto</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="city">City</label>
                  <select
                    id="city"
                    name="city"
                    className="form-select"
                    value={filters.city}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Cities</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="transmission">Transmission</label>
                  <select
                    id="transmission"
                    name="transmission"
                    className="form-select"
                    value={filters.transmission}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="year">Year</label>
                  <select
                    id="year"
                    name="year"
                    className="form-select"
                    value={filters.year}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Years</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                  </select>
                </div>
              </div>

              <div className="filters-actions">
                <button
                  className="btn btn-outline"
                  onClick={() =>
                    setFilters({
                      make: "",
                      model: "",
                      city: "",
                      priceRange: "",
                      year: "",
                      transmission: "",
                    })
                  }
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="all-cars-section">
          <div className="container">
            <div className="results-info">
              <p>Showing {displayedCars.length} cars</p>
            </div>

            <div className="car-grid">
              {displayedCars.map((car) => (
                <div key={car.id} className="car-card">
                  <div className="car-image-container">
                    <img src={car.image || "/placeholder.jpg"} alt={car.name} className="car-image" />
                    {car.featured && <div className="featured-tag">Featured</div>}
                  </div>
                  <div className="car-details">
                    <h3 className="car-title">{car.name}</h3>
                    <p className="car-location">{car.location}</p>
                    <div className="car-price-row">
                      <span className="car-price">PKR {car.price.toLocaleString()}</span>
                      <span className="car-posted">Posted {car.postedDays || 0} days ago</span>
                    </div>
                    <div className="car-specs">
                      <div className="car-spec">
                        <span className="spec-label">Year:</span>
                        <span className="spec-value">{car.year}</span>
                      </div>
                      <div className="car-spec">
                        <span className="spec-label">Mileage:</span>
                        <span className="spec-value">{car.mileage || 0} km</span>
                      </div>
                      <div className="car-spec">
                        <span className="spec-label">Fuel:</span>
                        <span className="spec-value">{car.fuel}</span>
                      </div>
                      <div className="car-spec">
                        <span className="spec-label">Transmission:</span> {/* Fixed class= to className= */}
                        <span className="spec-value">{car.transmission}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer navigate={handleNavigation} />
    </div>
  )
}

export default AllCars