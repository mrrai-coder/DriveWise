import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import "../pages/CarDetails.css";

// SVG Icons for specs
const specIcons = {
  year: (
    <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  mileage: (
    <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  fuel: (
    <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  transmission: (
    <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  make: (
    <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10m0 0v10m0-10L3 3m14 4l4 4" />
    </svg>
  ),
  model: (
    <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
  ),
  posted: (
    <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  email: (
    <svg className="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9 6 9-6V8l-9 6-9-6z" />
    </svg>
  ),
};

const CarDetails = () => {
  const navigate = useNavigate();
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    console.log("CarDetails: Received carId:", carId);
    if (!carId || typeof carId !== "string" || !/^[0-9a-fA-F]{24}$/.test(carId)) {
      console.error("CarDetails: Invalid carId format");
      setError("Invalid or missing car ID");
      setLoading(false);
      return;
    }
    const fetchCar = async () => {
      try {
        console.log("CarDetails: Fetching car data for ID:", carId);
        const response = await axios.get(`http://localhost:5000/api/cars/${carId}`);
        console.log("CarDetails: API response:", response.data);
        setCar(response.data);
        setLoading(false);
      } catch (err) {
        console.error("CarDetails: API error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load car details");
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId]);

  // Function to generate and download PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const lineHeight = 10;
    let y = margin;

    // Title
    doc.setFontSize(18);
    doc.text("Car Details", pageWidth / 2, y, { align: "center" });
    y += lineHeight;

    // Car Information
    doc.setFontSize(12);
    doc.text(`Name: ${car.name}`, margin, y);
    y += lineHeight;
    doc.text(`Price: PKR ${car.price.toLocaleString()}`, margin, y);
    y += lineHeight;
    doc.text(`Location: ${car.location}`, margin, y);
    y += lineHeight;
    doc.text(`Year: ${car.year}`, margin, y);
    y += lineHeight;
    doc.text(`Mileage: ${car.mileage.toLocaleString()} km`, margin, y);
    y += lineHeight;
    doc.text(`Fuel: ${car.fuel}`, margin, y);
    y += lineHeight;
    doc.text(`Transmission: ${car.transmission}`, margin, y);
    y += lineHeight;
    doc.text(`Make: ${car.make || "N/A"}`, margin, y);
    y += lineHeight;
    doc.text(`Model: ${car.model || "N/A"}`, margin, y);
    y += lineHeight;
    doc.text(`Posted: ${car.postedDays} days ago`, margin, y);
    y += lineHeight;
    doc.text(`Seller Email: ${car.seller_email}`, margin, y);
    y += lineHeight;

    if (car.featured) {
      doc.text("Featured: Yes", margin, y);
      y += lineHeight;
    }

    // Save the PDF
    doc.save(`${car.name.replace(/\s+/g, "_")}_details.pdf`);
  };

  if (loading) {
    return (
      <div className="site-wrapper">
        <Header navigate={navigate} />
        <main>
          <section className="container">
            <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
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
            <p className="text-lg text-red-600">{error}</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate("/all-cars")}>
              Back to All Cars
            </button>
          </section>
        </main>
        <Footer navigate={navigate} />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="site-wrapper">
        <Header navigate={navigate} />
        <main>
          <section className="container">
            <p className="text-lg text-red-600">No car data available</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate("/all-cars")}>
              Back to All Cars
            </button>
          </section>
        </main>
        <Footer navigate={navigate} />
      </div>
    );
  }

  const imageUrls = Array.isArray(car.images) && car.images.length > 0
    ? car.images.map(img => img.startsWith("/uploads") ? `http://localhost:5000${img}` : img)
    : ["https://via.placeholder.com/600x450?text=No+Image+Available"];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

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
                  navigate("/");
                }}
                className="hover:underline"
              >
                Home
              </a>{" "}
              /{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/all-cars");
                }}
                className="hover:underline"
              >
                All Cars
              </a>{" "}
              / <span className="font-semibold">{car.name}</span>
            </div>
            <div className="car-details-container">
              <div className="car-details-image">
                <div className="image-gallery">
                  <img
                    src={imageUrls[currentImageIndex]}
                    alt={`${car.name} ${currentImageIndex + 1}`}
                    className="transition-opacity duration-300"
                    onError={(e) => {
                      console.error("CarDetails: Image failed to load:", imageUrls[currentImageIndex]);
                      e.target.src = "https://via.placeholder.com/600x450?text=Image+Not+Found";
                    }}
                  />
                  {imageUrls.length > 1 && (
                    <div className="gallery-controls">
                      <button className="gallery-btn prev" onClick={handlePrevImage}>
                        ←
                      </button>
                      <button className="gallery-btn next" onClick={handleNextImage}>
                        →
                      </button>
                    </div>
                  )}
                  {car.featured && <div className="featured-tag">Featured</div>}
                </div>
                {imageUrls.length > 1 && (
                  <div className="thumbnail-container">
                    {imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`${car.name} thumbnail ${index + 1}`}
                        className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                        onClick={() => setCurrentImageIndex(index)}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100x70?text=Thumbnail";
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="car-details-info">
                <h1 className="car-title">{car.name}</h1>
                <p className="car-price">PKR {car.price.toLocaleString()}</p>
                <p className="car-location">{car.location}</p>
                <div className="car-specs">
                  <div className="car-spec">
                    {specIcons.year}
                    <span className="spec-label">Year:</span>
                    <span className="spec-value">{car.year}</span>
                  </div>
                  <div className="car-spec">
                    {specIcons.mileage}
                    <span className="spec-label">Mileage:</span>
                    <span className="spec-value">{car.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="car-spec">
                    {specIcons.fuel}
                    <span className="spec-label">Fuel:</span>
                    <span className="spec-value">{car.fuel}</span>
                  </div>
                  <div className="car-spec">
                    {specIcons.transmission}
                    <span className="spec-label">Transmission:</span>
                    <span className="spec-value">{car.transmission}</span>
                  </div>
                  <div className="car-spec">
                    {specIcons.make}
                    <span className="spec-label">Make:</span>
                    <span className="spec-value">{car.make || "N/A"}</span>
                  </div>
                  <div className="car-spec">
                    {specIcons.model}
                    <span className="spec-label">Model:</span>
                    <span className="spec-value">{car.model || "N/A"}</span>
                  </div>
                  <div className="car-spec">
                    {specIcons.posted}
                    <span className="spec-label">Posted:</span>
                    <span className="spec-value">{car.postedDays} days ago</span>
                  </div>
                  <div className="car-spec">
                    {specIcons.email}
                    <span className="spec-label">Seller Email:</span>
                    <span className="spec-value">{car.seller_email}</span>
                  </div>
                </div>
                <div className="car-actions">
                  <button className="btn btn-primary" onClick={() => navigate("/all-cars")}>
                    Back to All Cars
                  </button>
                  <button className="btn btn-primary" onClick={generatePDF}>
                    Download PDF
                  </button>
                </div>
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