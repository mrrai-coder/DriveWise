import Header from "../components/Header"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import PopularCategories from "../components/PopularCategories"
import FeaturedCars from "../components/FeaturedCars"
import PopularBrands from "../components/PopularBrands"
import WhyChooseUs from "../components/WhyChooseUs"
import Testimonials from "../components/Testimonials"
import CtaSection from "../components/CtaSection"

const HomePage = ({ navigate }) => {
  return (
    <div className="site-wrapper">
      <Header navigate={navigate} />
      <main>
        <HeroSection />
        <PopularCategories navigate={navigate} />
        <FeaturedCars navigate={navigate} />
        <PopularBrands />
        <WhyChooseUs />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer navigate={navigate} />
    </div>
  )
}

export default HomePage
