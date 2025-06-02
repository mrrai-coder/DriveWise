import logo from "../images/logo51.png"
import logo1 from "../logos/facebook-logo-20.png"
import logo2 from "../logos/instagram-logo-20.png"
import logo3 from "../logos/youtube-logo-20.png"
import logo4 from "../logos/twitter-logo-24.png"

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <img src={logo || "/placeholder.svg"} alt="Drive Wise logo" />
            {/* <p className="footer-description">
              Pakistan's premier online platform for buying and selling cars. Get the best value for your vehicle.
            </p> */}
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <img src={logo1 || "/placeholder.svg"} alt="Facebook logo" className="social-logo" />
              </a>
              <a href="#" aria-label="Instagram">
                <img src={logo2 || "/placeholder.svg"} alt="instagram logo" className="social-logo" />
              </a>
              <a href="#" aria-label="Twitter">
                <img src={logo4 || "/placeholder.svg"} alt="Twitter logo" className="social-logo" />
              </a>
              <a href="#" aria-label="Youtube">
                <img src={logo3 || "/placeholder.svg"} alt="Youtube logo" className="social-logo" />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">How It Works</a>
              </li>
              <li>
                <a href="#">Car Valuation</a>
              </li>
              <li>
                <a href="#">Car Financing</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Car Categories</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Sedans</a>
              </li>
              <li>
                <a href="#">SUVs</a>
              </li>
              <li>
                <a href="#">Hatchbacks</a>
              </li>
              <li>
                <a href="#">Luxury Cars</a>
              </li>
              <li>
                <a href="#">Commercial Vehicles</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <i className="fa fa-map-marker-alt contact-icon"></i>
                <span>123 Main Street, Lahore, Pakistan</span>
              </li>
              <li>
                <i className="fa fa-phone contact-icon"></i>
                <span>+92 300 1234567</span>
              </li>
              <li>
                <i className="fa fa-envelope contact-icon"></i>
                <span>info@drivewise.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} Drive Wise. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
