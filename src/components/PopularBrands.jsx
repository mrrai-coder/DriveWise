import toyota_logo from '../images/toyota-logo.png'; 
import mercedes_benz_logo from '../images/mercedes-benz-logo.png';
import hyundai_logo from '../images/hyundai-logo.png';
import kia_logo from '../images/kia-logo.png';
import suzuki_logo from '../images/suzuki-logo.png';

const PopularBrands = () => {
  const brands = [
    { name: "Toyota", logo: toyota_logo },
    { name: "Mercedes", logo: mercedes_benz_logo },
    { name: "Suzuki", logo: suzuki_logo },
    { name: "Hyundai", logo: hyundai_logo }, 
    { name: "KIA", logo: kia_logo },
  ];

  return (
    <section className="popular-brands-section">
      <div className="container">
        <h2 className="section-title text-center">Top New Car Brands</h2>

        <div className="brands-grid">
          {brands.map((brand, index) => (
            <div key={index} className="brand-card">
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={`${brand.name} logo`}
                className="brand-logo"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBrands;