"use client"

import { useState, useEffect } from "react"

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: "Muneeb Ahmed",
      initials: "MA",
      location: "Lahore, Pakistan",
      text: "I sold my car through Drive Wise and got a great price. The process was smooth and the team was very helpful throughout.",
      rating: 5,
      carSold: "Toyota Corolla 2019",
    },
    {
      id: 2,
      name: "Sarah Khan",
      initials: "SK",
      location: "Karachi, Pakistan",
      text: "Found my dream car on Drive Wise at a reasonable price. The verification process gave me confidence in my purchase.",
      rating: 5,
      carSold: "Honda Civic 2021",
    },
    {
      id: 3,
      name: "Muhammad Raza",
      initials: "MR",
      location: "Islamabad, Pakistan",
      text: "Drive Wise made selling my old car and buying a new one so easy. Their valuation was fair and the listing process was simple.",
      rating: 5,
      carSold: "Suzuki Swift 2018",
    },
    {
      id: 4,
      name: "Fatima Ali",
      initials: "FA",
      location: "Lahore, Pakistan",
      text: "Excellent platform for car buyers! The detailed car information and honest seller reviews helped me make the right decision.",
      rating: 5,
      carSold: "Toyota Yaris 2020",
    },
    {
      id: 5,
      name: "Ahmed Hassan",
      initials: "AH",
      location: "Faisalabad, Pakistan",
      text: "Sold my car within a week of listing. The platform attracts serious buyers and the transaction was completely secure.",
      rating: 5,
      carSold: "Honda City 2017",
    },
    {
      id: 6,
      name: "Ayesha Malik",
      initials: "AM",
      location: "Multan, Pakistan",
      text: "Great experience buying my first car. The team guided me through every step and ensured I got the best deal possible.",
      rating: 5,
      carSold: "Suzuki Alto 2019",
    },
    {
      id: 7,
      name: "Sajjad Ali",
      initials: "SA",
      location: "Peshawar, Pakistan",
      text: "Professional service and transparent pricing. I was able to compare multiple cars easily and found exactly what I was looking for.",
      rating: 5,
      carSold: "Toyota Fortuner 2021",
    },
    {
      id: 8,
      name: "Zara Ahmed",
      initials: "ZA",
      location: "Quetta, Pakistan",
      text: "The car inspection service gave me peace of mind. Bought a used car with confidence knowing its true condition.",
      rating: 5,
      carSold: "Honda BR-V 2020",
    },
  ]

  const cardsPerView = 3
  const maxSlide = Math.ceil(testimonials.length / cardsPerView) - 1

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1))
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, maxSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1))
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const getCurrentTestimonials = () => {
    const startIndex = currentSlide * cardsPerView
    return testimonials.slice(startIndex, startIndex + cardsPerView)
  }

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="section-subtitle">Real experiences from real customers</p>

        <div
          className="testimonials-slider"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="testimonials-grid">
            {getCurrentTestimonials().map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    <span>{testimonial.initials}</span>
                  </div>
                  <div className="testimonial-info">
                    <h3 className="testimonial-name">{testimonial.name}</h3>
                    <p className="testimonial-location">{testimonial.location}</p>
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="star">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-car-info">
                  <i className="fa fa-car"style={{ color: "#134276" }}></i>
                  <span>Sold: {testimonial.carSold}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="slider-arrow slider-arrow-left" onClick={prevSlide}>
          <i className="fa fa-chevron-left" style={{ color: "#134276" }}></i>
          </button>
          <button className="slider-arrow slider-arrow-right" onClick={nextSlide}>
            <i className="fa fa-chevron-right"style={{ color: "#134276" }}></i>
          </button>

          {/* Dots Indicator */}
          <div className="slider-dots">
            {[...Array(maxSlide + 1)].map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default Testimonials
