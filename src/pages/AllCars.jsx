import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./AllCars.css";

const AllCars = ({ navigate, filter }) => {
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    city: "",
    priceRange: "",
    year: "",
    transmission: "",
    category: filter?.category || "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [allCars, setAllCars] = useState([]);
  const [displayedCars, setDisplayedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cars");
        console.log("AllCars: Fetched cars:", response.data);
        setAllCars(response.data);
        setDisplayedCars(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load cars. Please try again.");
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Handle sort changes
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Apply filters and sorting
  useEffect(() => {
    let filteredCars = [...allCars];

    if (filters.make) {
      filteredCars = filteredCars.filter((car) => car.make === filters.make);
    }
    if (filters.model) {
      filteredCars = filteredCars.filter((car) => car.model === filters.model);
    }
    if (filters.city) {
      filteredCars = filteredCars.filter((car) => car.location.includes(filters.city));
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filteredCars = filteredCars.filter((car) => car.price >= min && car.price <= max);
    }
    if (filters.year) {
      filteredCars = filteredCars.filter((car) => car.year.toString() === filters.year);
    }
    if (filters.transmission) {
      filteredCars = filteredCars.filter((car) => car.transmission === filters.transmission);
    }
    if (filters.category) {
      filteredCars = filteredCars.filter((car) => car.category === filters.category);
    }

    switch (sortBy) {
      case "newest":
        filteredCars.sort((a, b) => a.postedDays - b.postedDays);
        break;
      case "oldest":
        filteredCars.sort((a, b) => b.postedDays - a.postedDays);
        break;
      case "price-low":
        filteredCars.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredCars.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setDisplayedCars(filteredCars);
  }, [filters, sortBy, allCars]);

  return (
    <div className="site-wrapper">
      <Header navigate={navigate} />
      <main>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">All Cars</h1>
            <div className="breadcrumbs">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("home");
                }}
              >
                Home
              </a>{" "}
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
                  <select
                    id="sort-by"
                    className="form-select"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
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
                  <label htmlFor="priceRange">Price Range (PKR)</label>
                  <select
                    id="priceRange"
                    name="priceRange"
                    className="form-select"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Prices</option>
                    <option value="500000-1000000">500,000 - 1,000,000</option>
                    <option value="1000000-1500000">1,000,000 - 1,500,000</option>
                    <option value="1500000-2000000">1,500,000 - 2,000,000</option>
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
                    <option value="">All Transmissions</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    <option value="Sedans">Sedans</option>
                    <option value="SUVs">SUVs</option>
                    <option value="Hatchbacks">Hatchbacks</option>
                    <option value="Luxury Cars">Luxury Cars</option>
                    <option value="Electric">Electric</option>
                    <option value="Budget Cars">Budget Cars</option>
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
                      category: "",
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
            {loading && <p>Loading cars...</p>}
            {error && <p style={{ color: "#ef4444" }}>{error}</p>}
            {!loading && !error && (
              <>
                <div className="results-info">
                  <p>Showing {displayedCars.length} cars</p>
                </div>
                <div className="car-grid">
                  {displayedCars.map((car) => {
                    const imageUrl = car.image && typeof car.image === "string" && car.image.startsWith("/uploads")
                      ? `http://localhost:5000${car.image}`
                      : "https://via.placeholder.com/300x200";
                    console.log("AllCars: Image URL for", car.name, ":", imageUrl);
                    console.log("AllCars: Car ID for", car.name, ":", car._id);
                    return (
                      <div
                        key={car._id}
                        className="car-card"
                        onClick={() => {
                          if (car._id && typeof car._id === "string") {
                            navigate("car-details", { carId: car._id });
                          } else {
                            console.error("AllCars: Invalid or missing car._id for", car.name, ":", car._id);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="car-image-container">
                          <img
                            src={imageUrl}
                            alt={car.name}
                            className="car-image"
                            onError={(e) => {
                              console.error("AllCars: Image failed to load:", imageUrl);
                              e.target.src = "https://via.placeholder.com/300x200";
                            }}
                          />
                          {car.featured && <div className="featured-tag">Featured</div>}
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
                    );
                  })}
                </div>
                <div className="pagination">
                  <button className="pagination-btn active">1</button>
                  <button className="pagination-btn">2</button>
                  <button className="pagination-btn">3</button>
                  <button className="pagination-btn">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

export default AllCars;