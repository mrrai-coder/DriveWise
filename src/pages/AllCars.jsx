import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./AllCars.css";

const AllCars = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "price-asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImages, setCurrentImages] = useState({}); // Track current image per car

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cars");
        setCars(response.data);
        setLoading(false);
        // Initialize current image index for each car
        const initialImages = {};
        response.data.forEach(car => {
          initialImages[car._id] = 0;
        });
        setCurrentImages(initialImages);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load cars");
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.category) query.append("category", filters.category);
      if (filters.minPrice) query.append("minPrice", filters.minPrice);
      if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
      if (filters.sort) query.append("sort", filters.sort);
      const response = await axios.get(`http://localhost:5000/api/cars?${query.toString()}`);
      setCars(response.data);
      setLoading(false);
      setCurrentPage(1);
      // Reset current images
      const initialImages = {};
      response.data.forEach(car => {
        initialImages[car._id] = 0;
      });
      setCurrentImages(initialImages);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to apply filters");
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "price-asc",
    });
    setCurrentPage(1);
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cars");
        setCars(response.data);
        setLoading(false);
        const initialImages = {};
        response.data.forEach(car => {
          initialImages[car._id] = 0;
        });
        setCurrentImages(initialImages);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load cars");
        setLoading(false);
      }
    };
    fetchCars();
  };

  const handleImageChange = (carId, index) => {
    setCurrentImages(prev => ({ ...prev, [carId]: index }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // TODO: Implement dynamic pagination with backend API
  };

  if (loading) {
    return (
      <div className="site-wrapper">
        <Header navigate={navigate} />
        <main>
          <section className="container">
            <p>Loading...</p>
          </section>
        </main>
        <Footer navigate={navigate} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="site-wrapper">
        <Header navigate={navigate} />
        <main>
          <section className="container">
            <p style={{ color: "#ef4444" }}>{error}</p>
          </section>
        </main>
        <Footer navigate={navigate} />
      </div>
    );
  }

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
                  navigate("/");
                }}
              >
                Home
              </a>{" "}
              / All Cars
            </div>
          </div>
        </section>
        <section className="advanced-filters-section">
          <div className="container">
            <div className="filters-container">
              <div className="filters-header">
                <h3>Advanced Filters</h3>
                <div className="sort-container">
                  <label htmlFor="sort">Sort by:</label>
                  <select
                    id="sort"
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="year-asc">Year: Old to New</option>
                    <option value="year-desc">Year: New to Old</option>
                  </select>
                </div>
              </div>
              <form onSubmit={handleFilterSubmit}>
                <div className="filters-grid">
                  <div className="filter-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="form-select"
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
                  <div className="filter-group">
                    <label htmlFor="minPrice">Min Price (PKR)</label>
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="form-select"
                    />
                  </div>
                  <div className="filter-group">
                    <label htmlFor="maxPrice">Max Price (PKR)</label>
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="form-select"
                    />
                  </div>
                </div>
                <div className="filters-actions">
                  <button type="button" className="btn btn-outline" onClick={handleResetFilters}>
                    Reset
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
        <section className="all-cars-section">
          <div className="container">
            <div className="results-info">
              Showing {cars.length} {cars.length === 1 ? "car" : "cars"}
            </div>
            <div className="car-grid">
              {cars.map((car) => {
                const imageUrls = Array.isArray(car.images) && car.images.length > 0
                  ? car.images.map(img => img.startsWith("/uploads") ? `http://localhost:5000${img}` : img)
                  : ["https://via.placeholder.com/300x200"];
                const currentImageIndex = currentImages[car._id] || 0;

                return (
                  <div key={car._id} className="car-card">
                    <div className="car-image-container">
                      {imageUrls.length > 0 ? (
                        <img
                          src={imageUrls[currentImageIndex]}
                          alt={car.name}
                          className="car-image"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200";
                            e.target.className = "image-fallback";
                            e.target.alt = "Image not available";
                          }}
                        />
                      ) : (
                        <div className="image-fallback">Image not available</div>
                      )}
                      {car.featured && <div className="featured-tag">Featured</div>}
                      {imageUrls.length > 1 && (
                        <div className="image-thumbnails">
                          {imageUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`${car.name} thumbnail ${index + 1}`}
                              className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                              onClick={() => handleImageChange(car._id, index)}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/60x40";
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="car-details">
                      <h2 className="car-title">{car.name}</h2>
                      <p className="car-price">PKR {car.price.toLocaleString()}</p>
                      <p className="car-location">{car.location}</p>
                      <div className="car-specs">
                        <div className="car-spec">
                          <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="spec-label">Year:</span>
                          <span className="spec-value">{car.year}</span>
                        </div>
                        <div className="car-spec">
                          <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="spec-label">Mileage:</span>
                          <span className="spec-value">{car.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="car-spec">
                          <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          <span className="spec-label">Fuel:</span>
                          <span className="spec-value">{car.fuel}</span>
                        </div>
                        <div className="car-spec">
                          <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                          <span className="spec-label">Transmission:</span>
                          <span className="spec-value">{car.transmission}</span>
                        </div>
                      </div>
                      <button
                        className="view-details-btn"
                        onClick={() => navigate(`/cars/${car._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pagination">
              {[1, 2, 3].map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

export default AllCars;