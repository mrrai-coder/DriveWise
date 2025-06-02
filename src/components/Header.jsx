"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../images/logo5.jpg"
import SignupForm from "./SignupForm"
import LoginForm from "./LoginForm"
import "./AuthForms.css"

const Header = ({ navigate }) => {
  const reactNavigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [signupFormOpen, setSignupFormOpen] = useState(false)
  const [loginFormOpen, setLoginFormOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const openSignupForm = () => {
    setSignupFormOpen(true)
    setLoginFormOpen(false)
  }

  const openLoginForm = () => {
    setLoginFormOpen(true)
    setSignupFormOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setMobileMenuOpen(false)
    reactNavigate("/")
    window.scrollTo(0, 0)
  }

  const handleLoginSuccess = () => {
    console.log("Login success triggered in Header")
    setIsLoggedIn(true)
    setLoginFormOpen(false)
    setSignupFormOpen(false)
  }

  const handleNavigation = (page, e) => {
    e.preventDefault()

    if (page === "home") {
      reactNavigate("/")
    } else if (page === "all-cars") {
      reactNavigate("/all-cars")
    } else if (page === "about") {
      reactNavigate("/about")
    } else if (page === "car-recommendation") {
      reactNavigate("/car-recommendation")
    } else if (page === "list-car") {
      reactNavigate("/list-car")
    }

    if (navigate) {
      navigate(page)
    }

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

          <nav className="desktop-nav desktop-only">
            <a href="#" onClick={(e) => handleNavigation("home", e)}>
              Home
            </a>
            <a href="#" onClick={(e) => handleNavigation("all-cars", e)}>
              All Cars
            </a>
            <a href="#" onClick={(e) => handleNavigation("about", e)}>
              About Us
            </a>
            {isLoggedIn && (
              <>
                <a href="#" onClick={(e) => handleNavigation("car-recommendation", e)}>
                  Car Recommendation
                </a>
                <a href="#" onClick={(e) => handleNavigation("list-car", e)}>
                  List Your Car
                </a>
              </>
            )}
          </nav>

          <div className="auth-buttons desktop-only">
            {isLoggedIn ? (
              <button className="btn btn-outline" onClick={handleLogout}>
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
              <a href="#" onClick={(e) => handleNavigation("about", e)}>
                About Us
              </a>
              {isLoggedIn && (
                <>
                  <a href="#" onClick={(e) => handleNavigation("car-recommendation", e)}>
                    Car Recommendation
                  </a>
                  <a href="#" onClick={(e) => handleNavigation("list-car", e)}>
                    List Your Car
                  </a>
                </>
              )}
              {isLoggedIn ? (
                <button className="btn btn-outline mobile-login" onClick={handleLogout}>
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

      <SignupForm isOpen={signupFormOpen} onClose={() => setSignupFormOpen(false)} onLoginSuccess={handleLoginSuccess} />
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