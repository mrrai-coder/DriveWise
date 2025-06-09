import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./AllCars.css";

const AllCars = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "price-asc",
    name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentImages, setCurrentImages] = useState({});
  const [cache, setCache] = useState({});

  const fetchCars = useCallback(async (filters, page) => {
    const cacheKey = `${JSON.stringify(filters)}-${page}`;
    if (cache[cacheKey]) {
      const { cars, totalPages, currentPage } = cache[cacheKey];
      setCars(cars);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.category) query.append("category", filters.category);
      if (filters.minPrice) query.append("minPrice", filters.minPrice);
      if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
      if (filters.sort) query.append("sort", filters.sort);
      if (filters.name) query.append("name", filters.name);
      query.append("page", page);
      query.append("limit", 6);

      const response = await axios.get(`http://localhost:5000/api/cars?${query.toString()}`);
      const { cars, totalPages, currentPage } = response.data;

      setCars(cars || []);
      setTotalPages(totalPages || 1);
      setCurrentPage(currentPage || 1);

      setCache(prev => ({
        ...prev,
        [cacheKey]: { cars, totalPages, currentPage },
      }));

      const initialImages = {};
      cars.forEach(car => {
        initialImages[car._id] = 0;
      });
      setCurrentImages(initialImages);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load cars. Please try again.");
      setLoading(false);
    }
  }, [cache]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialFilters = {
      category: queryParams.get("category") || "",
      minPrice: queryParams.get("minPrice") || "",
      maxPrice: queryParams.get("maxPrice") || "",
      sort: queryParams.get("sort") || "price-asc",
      name: queryParams.get("name") || "",
    };
    setFilters(initialFilters);
    setCurrentPage(parseInt(queryParams.get("page") || "1"));

    const timer = setTimeout(() => {
      fetchCars(initialFilters, parseInt(queryParams.get("page") || "1"));
    }, 300);

    return () => clearTimeout(timer);
  }, [location.search, fetchCars]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const queryString = new URLSearchParams(filters).toString();
    navigate(`/all-cars?${queryString}`);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "price-asc",
      name: "",
    };
    setFilters(resetFilters);
    setCurrentPage(1);
    navigate("/all-cars");
  };

  const handleImageChange = (carId, index) => {
    setCurrentImages(prev => ({ ...prev, [carId]: index }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const query = new URLSearchParams(filters);
    query.set("page", page);
    navigate(`/all-cars?${query.toString()}`);
  };

  const LoadingSkeleton = () => (
    <div className="car-card skeleton" role="status" aria-label="Loading car card">
      <div className="car-image-container skeleton-image"></div>
      <div className="car-details">
        <div className="skeleton-title"></div>
        <div className="skeleton-price"></div>
        <div className="skeleton-meta"></div>
        <div className="car-specs">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="car-spec skeleton-spec"></div>
          ))}
        </div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );

  const formatPrice = useCallback((price) => {
    return `PKR ${price.toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }, []);

  // Format mileage concisely (e.g., 23,454 -> 23.5K)
  const formatMileage = useCallback((mileage) => {
    if (!mileage) return "N/A";
    if (mileage >= 1000) {
      return `${(mileage / 1000).toFixed(1)}K km`;
    }
    return `${mileage.toLocaleString()} km`;
  }, []);

  if (loading) {
    return (
      <div className="site-wrapper">
        <Header />
        <main>
          <section className="container">
            <div className="car-grid">
              {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="site-wrapper">
        <Header />
        <main>
          <section className="container">
            <p style={{ color: "#3b82f6", textAlign: "center", padding: "20px" }}>
              {error}
            </p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="site-wrapper">
        <Header />
        <main>
          <section className="container">
            <div className="no-results" role="alert">
              <h2>No cars found</h2>
              <p>Try adjusting your filters or resetting them to see more options.</p>
              <button
                className="btn btn-outline"
                onClick={handleResetFilters}
                aria-label="Reset filters to view all cars"
              >
                Reset Filters
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-wrapper">
      <Header />
      <main>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">All Cars</h1>
            <div className="breadcrumbs">
              <a href="#" onClick={() => navigate("/")}>
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
                  <label htmlFor="sort">Sort By:</label>
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
                      min="0"
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
                      min="0"
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
                  : ["https://via.placeholder.com/300x225"];
                const currentImageIndex = currentImages[car._id] || 0;

                return (
                  <div key={car._id} className="car-card" role="article" aria-labelledby={`car-title-${car._id}`}>
                    <div className="car-image-container">
                      {imageUrls.length > 0 ? (
                        <img
                          src={imageUrls[currentImageIndex]}
                          alt={`${car.name} image`}
                          className="car-image"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x225";
                            e.target.className = "image-fallback";
                            e.target.alt = "Image not available";
                          }}
                        />
                      ) : (
                        <div className="image-fallback">Image not available</div>
                      )}
                      {car.featured && <div className="featured-tag">Featured</div>}
                      {car.category && (
                        <div className="category-badge">{car.category}</div>
                      )}
                      {imageUrls.length > 1 && (
                        <div className="image-thumbnails" role="group" aria-label="Image thumbnails">
                          {imageUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`${car.name} thumbnail ${index + 1}`}
                              className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                              onClick={() => handleImageChange(car._id, index)}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/40x30";
                              }}
                              tabIndex={0}
                              role="button"
                              aria-pressed={index === currentImageIndex}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="car-details">
                      <h2 className="car-title" id={`car-title-${car._id}`}>{car.name}</h2>
                      <p className="car-price">{formatPrice(car.price)}</p>
                      <div className="car-meta">
                        <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{car.location || "Location not specified"}</span>
                      </div>
                      <div className="car-specs" role="list">
                        <div className="car-spec" role="listitem" aria-label="Year">
                          <svg className="spec-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h12v16H6V4zm2 5h8v2H8V9zm0 4h8v2H8v-2zm0 4h8v2H8v-2z" />
                          </svg>
                          <span className="spec-value">{car.year || "N/A"}</span>
                        </div>
                        <div className="car-spec" role="listitem" aria-label="Mileage">
                          <svg className="spec-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2a10 10 0 00-7.07 17.07l1.41-1.41A8 8 0 114 12h2l-3 3-3-3h2a10 10 0 0016 0h2l-3 3-3-3h2a8 8 0 01-2.93 5.66l1.41 1.41A10 10 0 0012 2z" />
                          </svg>
                          <span className="spec-value">{formatMileage(car.mileage)}</span>
                        </div>
                        <div className="car-spec" role="listitem" aria-label="Fuel Type">
                          <svg className="spec-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17 3h-2v3h2V3zm-2 16h2v-3h-2v3zm4-8h3v2h-3v-2zm-8-6H9v2h2V5zm8 12v-2h-3v2h3zM5 15h3v2H5v-2zm7-4a2 2 0 100-4 2 2 0 000 4zm0 2a4 4 0 110-8 4 4 0 010 8zm0 2c5.523 0 10-4.477 10-10S17.523 3 12 3 2 7.477 2 13s4.477 10 10 10z" />
                          </svg>
                          <span className="spec-value">{car.fuel || "N/A"}</span>
                        </div>
                        <div className="car-spec" role="listitem" aria-label="Transmission">
                          <svg className="spec-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2a10 10 0 00-7 2.93V3h-2v4h4v-2H5.93A8 8 0 014 12h2a6 6 0 0012 0h2a8 8 0 01-1.93 5.07V21h2v-4h-4v2h1.93A8 8 0 0120 12a8 8 0 01-8-8z" />
                          </svg>
                          <span className="spec-value">{car.transmission || "N/A"}</span>
                        </div>
                      </div>
                      <button
                        className="view-details-btn"
                        onClick={() => navigate(`/cars/${car._id}`)}
                        aria-label={`View details for ${car.name}`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="pagination" role="navigation" aria-label="Pagination">
                {[...Array(totalPages).keys()].map(page => (
                  <button
                    key={page + 1}
                    className={`pagination-btn ${currentPage === page + 1 ? "active" : ""}`}
                    onClick={() => handlePageChange(page + 1)}
                    aria-current={currentPage === page + 1 ? "page" : undefined}
                    aria-label={`Page ${page + 1}`}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AllCars;