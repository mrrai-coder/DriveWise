import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./CarDetails.css";

const CarDetails = ({ navigate, carId }) => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("CarDetails: Received carId:", carId);
    const fetchCar = async () => {
      if (!carId || typeof carId !== "string") {
        setError("Invalid or missing car ID");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/${carId}`);
        setCar(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load car details");
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId]);

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
            <button className="btn btn-primary" onClick={() => navigate("all-cars")}>
              Back to All Cars
            </button>
          </section>
        </main>
        <Footer navigate={navigate} />
      </div>
    );
  }

  const imageUrl = car.image && typeof car.image === "string" && car.image.startsWith("/uploads")
    ? `http://localhost:5000${car.image}`
    : "https://via.placeholder.com/300x200";
  console.log("CarDetails: Image URL for", car.name, ":", imageUrl);

  return (
    <div className="site-wrapper">
      <Header navigate={navigate} />
      <main>
        <section className="car-details-section">
          <div className="container">
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
              /{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("all-cars");
                }}
              >
                All Cars
              </a>{" "}
              / <span>{car.name}</span>
            </div>
            <div className="car-details-container">
              <div className="car-details-image">
                <img
                  src={imageUrl}
                  alt={car.name}
                  onError={(e) => {
                    console.error("CarDetails: Image failed to load:", imageUrl);
                    e.target.src = "https://via.placeholder.com/300x200";
                  }}
                />
                {car.featured && <div className="featured-tag">Featured</div>}
              </div>
              <div className="car-details-info">
                <h1 className="car-title">{car.name}</h1>
                <p className="car-price">PKR {car.price.toLocaleString()}</p>
                <p className="car-location">{car.location}</p>
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
                  <div className="car-spec">
                    <span className="spec-label">Make:</span>
                    <span className="spec-value">{car.make || "N/A"}</span>
                  </div>
                  <div className="car-spec">
                    <span className="spec-label">Model:</span>
                    <span className="spec-value">{car.model || "N/A"}</span>
                  </div>
                  <div className="car-spec">
                    <span className="spec-label">Posted:</span>
                    <span className="spec-value">{car.postedDays} days ago</span>
                  </div>
                  <div className="car-spec">
                    <span className="spec-label">Seller Email:</span>
                    <span className="spec-value">{car.seller_email}</span>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("all-cars")}>
                  Back to All Cars
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

export default CarDetails;