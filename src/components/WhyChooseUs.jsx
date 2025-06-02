const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: "💰",
      title: "Best Market Value",
      description: "Get the best price for your car with our market analysis and valuation tools.",
    },
    {
      id: 2,
      icon: "✅",
      title: "Verified Listings",
      description: "All our listings are verified to ensure you get genuine and quality vehicles.",
    },
    {
      id: 3,
      icon: "⚡",
      title: "Quick Process",
      description: "Our streamlined process ensures you can buy or sell your car quickly and efficiently.",
    },
  ]

  return (
    <section className="why-choose-us-section">
      <div className="container">
        <h2 className="section-title text-center">Why Choose Drive Wise?</h2>

        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">
                <span>{feature.icon}</span>
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
