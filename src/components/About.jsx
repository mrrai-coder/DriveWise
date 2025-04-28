"use client"
import Header from "./components/Header"
import Footer from "./components/Footer"

const About = ({ navigate }) => {
  // Company stats
  const stats = [
    { id: 1, value: "10,000+", label: "Cars Listed" },
    { id: 2, value: "5,000+", label: "Happy Customers" },
    { id: 3, value: "500+", label: "Verified Dealers" },
    { id: 4, value: "50+", label: "Cities Covered" },
  ]

  // Team members
  const team = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "With 15+ years in the automotive industry, Sarah founded Drive-Wise to revolutionize how people buy and sell cars.",
      avatar: "https://via.placeholder.com/200",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Chief Technology Officer",
      bio: "Michael leads our tech team, ensuring Drive-Wise offers the most innovative and user-friendly car shopping experience.",
      avatar: "https://via.placeholder.com/200",
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Head of Operations",
      bio: "Aisha oversees day-to-day operations, focusing on creating seamless experiences for both buyers and sellers.",
      avatar: "https://via.placeholder.com/200",
    },
    {
      id: 4,
      name: "David Rodriguez",
      role: "Marketing Director",
      bio: "David brings creative marketing strategies that help connect car buyers with their perfect vehicles.",
      avatar: "https://via.placeholder.com/200",
    },
  ]

  // Core values
  const values = [
    {
      id: 1,
      title: "Transparency",
      description: "We believe in complete honesty about every vehicle listed on our platform.",
      icon: "🔍",
    },
    {
      id: 2,
      title: "Quality",
      description: "We maintain high standards for all listings to ensure customer satisfaction.",
      icon: "⭐",
    },
    {
      id: 3,
      title: "Innovation",
      description: "We continuously improve our platform with the latest technology.",
      icon: "💡",
    },
    {
      id: 4,
      title: "Customer First",
      description: "Every decision we make prioritizes the needs of our users.",
      icon: "👥",
    },
  ]

  return (
    <div className="site-wrapper">
      <Header navigate={navigate} />
      <main>
        {/* Hero Section */}
        <section className="about-hero-section">
          <div className="container">
            <div className="about-hero-content">
              <h1 className="about-title">About Drive-Wise</h1>
              <div className="about-divider"></div>
              <p className="about-subtitle">The Smarter Way to Choose Your Next Car</p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="about-story-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2 className="section-title">Our Story</h2>
                <p className="about-text">
                  Founded in 2020, Drive-Wise was born from a simple idea: car buying should be straightforward,
                  transparent, and even enjoyable. Our founder, Sarah Johnson, experienced firsthand the frustration of
                  searching for a reliable vehicle through traditional methods.
                </p>
                <p className="about-text">
                  After months of visiting dealerships, scrolling through endless listings with incomplete information,
                  and feeling pressured by salespeople, Sarah envisioned a better way. She assembled a team of
                  automotive experts and tech innovators to create Drive-Wise – a platform where transparency, quality,
                  and user experience come first.
                </p>
                <p className="about-text">
                  Today, Drive-Wise has grown into Pakistan's trusted automotive marketplace, connecting thousands of
                  buyers with their perfect vehicles. We've simplified the car buying process while providing all the
                  detailed information needed to make confident decisions.
                </p>
              </div>
              <div className="about-image-container">
                <div className="about-image-wrapper">
                  <img src="https://via.placeholder.com/500x400" alt="Drive-Wise team" className="about-image" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="about-stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.id} className="stat-card">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="about-mission-section">
          <div className="container">
            <div className="mission-content">
              <h2 className="section-title text-center">Our Mission</h2>
              <p className="mission-text text-center">
                At Drive-Wise, we're on a mission to transform the car buying experience in Pakistan. We believe
                everyone deserves access to reliable information, fair prices, and a stress-free process when making one
                of life's major purchases.
              </p>
              <div className="mission-quote">
                <blockquote>
                  "We're not just listing cars – we're creating a community where knowledge, transparency and trust
                  drive every transaction."
                </blockquote>
                <cite>— Sarah Johnson, Founder & CEO</cite>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="about-values-section">
          <div className="container">
            <h2 className="section-title text-center">Our Core Values</h2>
            <div className="values-grid">
              {values.map((value) => (
                <div key={value.id} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-team-section">
          <div className="container">
            <h2 className="section-title text-center">Meet Our Team</h2>
            <p className="team-subtitle text-center">The passionate people behind Drive-Wise</p>
            <div className="team-grid">
              {team.map((member) => (
                <div key={member.id} className="team-card">
                  <div className="team-avatar-container">
                    <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="team-avatar" />
                  </div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="about-join-section">
          <div className="container">
            <div className="join-content">
              <h2 className="join-title">Join the Drive-Wise Community</h2>
              <p className="join-text">
                Whether you're buying, selling, or just browsing, we're here to make your automotive journey better.
                Experience the Drive-Wise difference today.
              </p>
              <div className="join-buttons">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (navigate) navigate("all-cars")
                  }}
                  className="btn btn-primary"
                >
                  Browse Cars
                </a>
                <a href="#" className="btn btn-outline">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer navigate={navigate} />
    </div>
  )
}

export default About
