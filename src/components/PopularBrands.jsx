import toyota_logo from "../images/toyota-logo1.png"
import Audi_logo from "../images/Audi_logo.png"
import hyundai_logo from "../images/hyundai_logo.png"
import mercedes_logo from "../images/mercedes_logo.png"
import Honda_logo from "../images/Honda_logo.png"
import JAC_logo from "../images/JAC_logo.png"

const PopularBrands = () => {
  const brands = [
    {
      name: "Toyota",
      logo: toyota_logo,
      subtitle: "AUTOMOTIVE",
      shape: "shield",
    },
    {
      name: "Hyundai",
      logo: hyundai_logo,
      subtitle: "SUPERCAR",
      shape: "shield",
    },
    {
      name: "Honda",
      logo: Honda_logo,
      subtitle: "MECHANIC GEAR",
      shape: "shield",
    },
    {
      name: "Audi",
      logo: Audi_logo,
      subtitle: "MECHANIC TOOL",
      shape: "shield",
    },
    {
      name: "Mercedes",
      logo: mercedes_logo,
      subtitle: "Racing Speed",
      shape: "shield",
    },
    {
      name: "JAC",
      logo: JAC_logo,
      subtitle: "MECHANIC GEAR",
      shape: "shield",
    },
  ]

  return (
    <section className="popular-brands-section">
      <div className="container">
        <h2 className="section-title text-center">Top New Car Brands</h2>

        <div className="brands-grid">
          {brands.map((brand, index) => (
            <div key={index} className="brand-card" style={{ animationDelay: `${index * 0.4}s` }}>
              <div className={`brand-badge ${brand.shape}`}>
                <div className="badge-content">
                  <div className="brand-logo-container">
                    <img src={brand.logo || "/placeholder.svg"} alt={`${brand.name} logo`} className="brand-logo-img" />
                  </div>
                  <div className="brand-text">
                    <div className="brand-subtitle">{brand.subtitle}</div>
                    <div className="brand-name">{brand.name}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularBrands
