"use client"
import { useNavigate } from "react-router-dom"
import AI_img from "../images/Our_Adv/AI_img.png"
import bestprice_img from "../images/Our_Adv/bestprice_img.png"
import secure_img from "../images/Our_Adv/secure_img.png"

const OurAdvantages = ({ navigate }) => {
  const reactNavigate = useNavigate()

  const advantages = [
    {
      id: 1,
      image: AI_img,
      title: "AI-Powered Recommendations",
      description:
        "Our advanced AI analyzes your preferences, budget, and lifestyle to recommend the perfect car matches. Get personalized suggestions based on real data and smart algorithms.",
      bgColor: "#4a90e2",
    },
    {
      id: 2,
      image: bestprice_img,
      title: "Best Price Guarantee",
      description:
        "We compare prices across multiple dealers and private sellers to ensure you get the best deal. Our transparent pricing system shows market value and negotiation insights.",
      bgColor: "#4a90e2",
    },
    {
      id: 3,
      image: secure_img,
      title: "Verified & Secure",
      description:
        "Every car listing is verified through our comprehensive inspection process. All transactions are secure with buyer protection and detailed vehicle history reports.",
      bgColor: "#4a90e2",
    },
  ]

  const handleLearnMore = () => {
    reactNavigate("/about")
    if (navigate) {
      navigate("about")
    }
    window.scrollTo(0, 0)
  }

  return (
    <section className="advantages-section">
      <div className="container">
        <div className="advantages-header">
          <p className="advantages-subtitle">We Are The Best</p>
          <h2 className="advantages-title">
            OUR <span className="advantages-highlight">ADVANTAGES</span>
          </h2>
        </div>

        <div className="advantages-grid">
          {advantages.map((advantage) => (
            <div key={advantage.id} className="advantage-card">
              <div className="advantage-image-wrapper" style={{ backgroundColor: `${advantage.bgColor}20` }}>
                <img src={advantage.image || "/placeholder.svg"} alt={advantage.title} className="advantage-image" />
              </div>
              <h3 className="advantage-title">{advantage.title}</h3>
              <p className="advantage-description">{advantage.description}</p>
            </div>
          ))}
        </div>

        <div className="advantages-cta">
          <button className="advantages-btn" onClick={handleLearnMore}>
            LEARN MORE
          </button>
        </div>
      </div>
    </section>
  )
}

export default OurAdvantages
