const WhyChooseUs = () => {
  const features = [
    {
      icon: "fa-dollar-sign",
      title: "Best Market Value",
      description: "Get the best price for your car with our market analysis and valuation tools.",
    },
    {
      icon: "fa-check-circle",
      title: "Verified Listings",
      description: "All our listings are verified to ensure you get genuine and quality vehicles.",
    },
    {
      icon: "fa-clock",
      title: "Quick Process",
      description: "Our streamlined process ensures you can buy or sell your car quickly and efficiently.",
    },
  ]

  return (
    <section className="why-choose-section">
      <div className="container">
        <h2 className="section-title text-center">Why Choose Drive Wise?</h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <i className={`fa ${feature.icon}`}></i>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
