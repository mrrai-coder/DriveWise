import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeaturedCars = ({ navigate }) => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cars?featured=true');
        console.log('FeaturedCars: Fetched cars:', response.data);
        setFeaturedCars(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load featured cars');
        setLoading(false);
      }
    };
    fetchFeaturedCars();
  }, []);

  return (
    <section className="featured-cars-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Cars</h2>
          <a
            href="#"
            className="view-all"
            onClick={(e) => {
              e.preventDefault();
              navigate('all-cars');
            }}
          >
            View all <i className="fa fa-chevron-right"></i>
          </a>
        </div>
        {loading && <p>Loading featured cars...</p>}
        {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
        {!loading && !error && (
          <div className="car-grid">
            {featuredCars.length === 0 && (
              <p>No featured cars available</p>
            )}
            {featuredCars.map((car) => {
              const imageUrl = car.image && typeof car.image === 'string' && car.image.startsWith('/uploads')
                ? `http://localhost:5000${car.image}`
                : 'https://via.placeholder.com/300x200';
              console.log('FeaturedCars: Image URL for', car.name, ':', imageUrl);
              console.log('FeaturedCars: Car ID for', car.name, ':', car._id);
              return (
                <div
                  key={car._id}
                  className="car-card"
                  onClick={() => {
                    if (car._id && typeof car._id === 'string') {
                      navigate('car-details', { carId: car._id });
                    } else {
                      console.error('FeaturedCars: Invalid or missing car._id for', car.name, ':', car._id);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="car-image-container">
                    <img
                      src={imageUrl}
                      alt={car.name}
                      className="car-image"
                      onError={(e) => {
                        console.error('FeaturedCars: Image failed to load:', imageUrl);
                        e.target.src = 'https://via.placeholder.com/300x200';
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;