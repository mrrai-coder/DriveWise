"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../images/logo5.jpg"
import SignupForm from "./SignupForm"
import LoginForm from "./LoginForm"
import "./AuthForms.css"

const Header = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [signupFormOpen, setSignupFormOpen] = useState(false)
  const [loginFormOpen, setLoginFormOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    console.log("useNavigate in Header:", typeof navigate)
  }, [navigate])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const openSignupForm = () => {
    setSignupFormOpen(true)
    setLoginFormOpen(false)
  }

  const openLoginForm = () => {
    setLoginFormOpen(true)
    setSignupFormOpen(false)
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    navigate("/")
    window.scrollTo(0, 0)
  }

  const handleNavigation = (page, e) => {
    e.preventDefault()
    console.log("Navigating to:", page)
    navigate(`/${page === "home" ? "" : page}`)
    setMobileMenuOpen(false)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <header className="main-header">
        <div className="container flex-between">
          <a href="#" onClick={(e) => handleNavigation("home", e)} className="logo">
            <img src={logo || "/placeholder.svg"} alt="Drive Wise logo" />
          </a>

          <button className="mobile-menu-btn mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <i className="fa fa-times"></i> : <i className="fa fa-bars"></i>}
          </button>

          {!isMobile && (
            <nav className="desktop-nav desktop-only">
              <a href="#" onClick={(e) => handleNavigation("home", e)} className="nav-link">
                Home
              </a>
              {isLoggedIn && (
                <>
                  <a href="#" onClick={(e) => handleNavigation("all-cars", e)} className="nav-link">
                    All Cars
                  </a>
                  <a href="#" onClick={(e) => handleNavigation("sell-car", e)} className="nav-link">
                    Sell Car
                  </a>
                  <a href="#" onClick={(e) => handleNavigation("recommend", e)} className="nav-link">
                    Car Recommendation
                  </a>
                </>
              )}
              <a href="#" onClick={(e) => handleNavigation("about", e)} className="nav-link">
                About Us
              </a>
              {isLoggedIn && (
                <a href="#" onClick={(e) => handleNavigation("profile", e)} className="nav-link">
                  Profile
                </a>
              )}
            </nav>
          )}

          {!isMobile && (
            <div className="auth-buttons desktop-only">
              {isLoggedIn ? (
                <button className="btn btn-primary" onClick={handleLogout}>
                  <i className="fa fa-sign-out"></i> Log Out
                </button>
              ) : (
                <>
                  <button id="signup-btn" className="btn btn-primary" onClick={openSignupForm}>
                    <i className="fa fa-user"></i> Sign Up
                  </button>
                  <button id="login-btn" className="btn btn-outline" onClick={openLoginForm}>
                    <i className="fa fa-sign-in"></i> Log In
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav">
            <nav>
              <a href="#" onClick={(e) => handleNavigation("home", e)} className="nav-link">
                Home
              </a>
              {isLoggedIn && (
                <>
                  <a href="#" onClick={(e) => handleNavigation("all-cars", e)} className="nav-link">
                    All Cars
                  </a>
                  <a href="#" onClick={(e) => handleNavigation("sell-car", e)} className="nav-link">
                    Sell Car
                  </a>
                  <a href="#" onClick={(e) => handleNavigation("recommend", e)} className="nav-link">
                    Car Recommendation
                  </a>
                </>
              )}
              <a href="#" onClick={(e) => handleNavigation("about", e)} className="nav-link">
                About Us
              </a>
              {isLoggedIn && (
                <a href="#" onClick={(e) => handleNavigation("profile", e)} className="nav-link">
                  Profile
                </a>
              )}
              {isLoggedIn ? (
                <button className="btn btn-primary mobile-logout" onClick={handleLogout}>
                  <i className="fa fa-sign-out"></i> Log Out
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-primary mobile-signup"
                    onClick={() => {
                      openSignupForm()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <i className="fa fa-user"></i> Sign Up
                  </button>
                  <button
                    className="btn btn-outline mobile-login"
                    onClick={() => {
                      openLoginForm()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <i className="fa fa-sign-in"></i> Log In
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <SignupForm isOpen={signupFormOpen} onClose={() => setSignupFormOpen(false)} openLogin={openLoginForm} />
      <LoginForm
        isOpen={loginFormOpen}
        onClose={() => setLoginFormOpen(false)}
        openSignup={openSignupForm}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}

export default Header