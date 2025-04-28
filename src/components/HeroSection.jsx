const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-bg"></div>
      <div className="container">
        <div className="hero-content">
          {/* <h2 className="subtitle">Car fame</h2> */}
          <h1 className="title">
          The Best Online Platform <span className='block-md-inline'>to Buy Your Next Car</span>
            {/* <span className="block">and sell used cars</span> */}
          </h1>
          <div className="divider"></div>
          <p className="description">Buy your car for what it's really worth quicker than ever</p>

          <div className="hero-actions">
            <button className="btn btn-primary">
              <i className="fa fa-search"></i> SEARCH CAR
            </button>
            <a href="#" className="btn-text">
              Find out more <i className="fa fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
