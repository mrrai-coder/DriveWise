
"use client"

import { useState, useContext } from "react";
import logo from "../images/logo5.png";
import logo1 from "../logos/facebook-logo-20.png";
import logo2 from "../logos/instagram-logo-20.png";
import logo3 from "../logos/youtube-logo-20.png";
import logo4 from "../logos/twitter-logo-24.png";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { AuthContext } from "../AuthContext";
import "./AuthForms.css";

const Header = ({ navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signupFormOpen, setSignupFormOpen] = useState(false);
  const [loginFormOpen, setLoginFormOpen] = useState(false);
  
  // Safely access AuthContext
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;
  const logout = authContext ? authContext.logout : () => {};

  const openSignupForm = () => {
    setSignupFormOpen(true);
    setLoginFormOpen(false);
  };

  const openLoginForm = () => {
    setLoginFormOpen(true);
    setSignupFormOpen(false);
  };

  const handleNavigation = (page, e) => {
    e.preventDefault();
    console.log("Header: Attempting to navigate to:", page);
    if (navigate) {
      navigate(page);
      setMobileMenuOpen(false);
    } else {
      console.error("Header: Navigate function is undefined");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("home");
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="top-nav">
        <div className="container flex-between">
          <div className="nav-links">
            <p className="top-header">Drive Wise – The Smarter Way to Choose Your Next Car</p>
          </div>
          <div className="social-links desktop-only">
            <a href="#" aria-label="Facebook">
              <img src={logo1 || "/placeholder.svg"} alt="Facebook logo" className="social-logo" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src={logo2 || "/placeholder.svg"} alt="Instagram logo" className="social-logo" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={logo4 || "/placeholder.svg"} alt="Twitter logo" className="social-logo" />
            </a>
            <a href="#" aria-label="Youtube">
              <img src={logo3 || "/placeholder.svg"} alt="Youtube logo" className="social-logo" />
            </a>
          </div>
        </div>
      </div>

      <header className="main-header">
        <div className="container flex-between">
          <a href="#" onClick={(e) => handleNavigation("home", e)} className="logo">
            <img src={logo || "/placeholder.svg"} alt="Drive Wise logo" />
          </a>

          <button className="mobile-menu-btn mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
          </button>

          <nav className="desktop-nav desktop-only">
            <a href="#" onClick={(e) => handleNavigation("home", e)}>
              Home
            </a>
            <a href="#" onClick={(e) => handleNavigation("all-cars", e)}>
              All Cars
            </a>
            <a href="#" onClick={(e) => handleNavigation("car-recommendation", e)}>
              Car Recommendation
            </a>
            <a href="#" onClick={(e) => handleNavigation("about", e)}>
              About Us
            </a>
            {user && (
              <a href="#" onClick={(e) => handleNavigation("sell-car", e)}>
                Sell Your Car
              </a>
            )}
          </nav>

          <div className="auth-buttons desktop-only">
            {user ? (
              <button className="btn btn-outline" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Log Out
              </button>
            ) : (
              <>
                <button id="signup-btn" className="btn btn-primary" onClick={openSignupForm}>
                  <i className="fas fa-user"></i> Sign Up
                </button>
                <button id="login-btn" className="btn btn-outline" onClick={openLoginForm}>
                  <i className="fas fa-sign-in-alt"></i> Log In
                </button>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav">
            <nav>
              <a href="#" onClick={(e) => handleNavigation("home", e)}>
                Home
              </a>
              <a href="#" onClick={(e) => handleNavigation("all-cars", e)}>
                All Cars
              </a>
              <a href="#" onClick={(e) => handleNavigation("car-recommendation", e)}>
                Car Recommendation
              </a>
              <a href="#" onClick={(e) => handleNavigation("about", e)}>
                About Us
              </a>
              {user && (
                <a href="#" onClick={(e) => handleNavigation("sell-car", e)}>
                  Sell Your Car
                </a>
              )}
              {user ? (
                <button className="btn btn-outline mobile-login" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Log Out
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-primary mobile-signup"
                    onClick={() => {
                      openSignupForm();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <i className="fas fa-user"></i> Sign Up
                  </button>
                  <button
                    className="btn btn-outline mobile-login"
                    onClick={() => {
                      openLoginForm();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <i className="fas fa-sign-in-alt"></i> Log In
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <SignupForm isOpen={signupFormOpen} onClose={() => setSignupFormOpen(false)} />
      <LoginForm
        isOpen={loginFormOpen}
        onClose={() => setLoginFormOpen(false)}
        openSignup={openSignupForm}
      />
    </>
  );
};

export default Header;
