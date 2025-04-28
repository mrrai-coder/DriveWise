const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      initials: "JD",
      rating: 5,
      text: "I discovered the perfect car recommendation on Drive Wise. The process was smooth, and the team was super helpful in guiding me to the right choice.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Sarah Khan",
      initials: "SK",
      rating: 5,
      text: "Found my dream ride through Drive Wise's expert recommendations. Their detailed insights gave me full confidence in my choice.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Muhammad Raza",
      initials: "MR",
      rating: 4,
      text: "Drive Wise made exploring and booking the right car incredibly easy. Their smart suggestions and easy booking process saved me so much time!",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  ]

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title text-center">What Our Customers Say</h2>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="testimonial-avatar"
                />
                <div className="testimonial-meta">
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa fa-star ${i < testimonial.rating ? "star-active" : "star-inactive"}`}
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
