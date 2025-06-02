import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import PopularCategories from "../components/PopularCategories"
import FeaturedCars from "../components/FeaturedCars"
import PopularBrands from "../components/PopularBrands"
import OurAdvantages from "../components/OurAdvantages"
import WhyChooseUs from "../components/WhyChooseUs"
import Testimonials from "../components/Testimonials"
import CtaSection from "../components/CtaSection"

const HomePage = () => {
  const navigate = useNavigate()

  // Navigation function to pass to components
  const handleNavigation = (page) => {
    if (page === "home") {
      navigate("/")
    } else if (page === "all-cars") {
      navigate("/all-cars")
    } else if (page === "about") {
      navigate("/about")
    }
    // Scroll to top when navigating
    window.scrollTo(0, 0)
  }

  return (
    <div className="site-wrapper">
      <Header navigate={handleNavigation} />
      <main>
        <HeroSection />
        <PopularCategories navigate={handleNavigation} />
        <FeaturedCars navigate={handleNavigation} />
        <PopularBrands />
        <OurAdvantages navigate={handleNavigation} />
        <WhyChooseUs />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer navigate={handleNavigation} />
    </div>
  )
}

export default HomePage
