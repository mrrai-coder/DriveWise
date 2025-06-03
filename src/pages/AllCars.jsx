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

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cars");
        setCars(response.data);
        setLoading(false);
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
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cars");
        setCars(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load cars");
        setLoading(false);
      }
    };
    fetchCars();
  };

  const handleCarClick = (carId) => {
    navigate(`/CarDetails/${carId}`); // Absolute path
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
              {cars.map((car) => (
                <div
                  key={car._id}
                  className="car-card"
                  onClick={() => handleCarClick(car._id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="car-image-container">
                    <img
                      src={
                        Array.isArray(car.images) && car.images.length > 0
                          ? car.images[0].startsWith("/uploads")
                            ? `http://localhost:5000${car.images[0]}`
                            : car.images[0]
                          : "https://via.placeholder.com/300x200"
                      }
                      alt={car.name}
                      className="car-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200";
                      }}
                    />
                    {car.featured && <div className="featured-tag">Featured</div>}
                  </div>
                  <div className="car-details">
                    <h2 className="car-title">{car.name}</h2>
                    <p className="car-location">{car.location}</p>
                    <div className="car-price-row">
                      <span className="car-price">PKR {car.price.toLocaleString()}</span>
                      <span className="car-posted">{car.postedDays} days ago</span>
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
              ))}
            </div>
            <div className="pagination">
              <button className="pagination-btn">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
            </div>
          </div>
        </section>
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

export default AllCars;