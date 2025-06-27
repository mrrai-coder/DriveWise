"use client"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
const  = 'https://drivewise-ahru.onrender.com';
const PopularCategories = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Category icons and colors
  const categoryStyles = {
    Sedans: { icon: "🚗", color: "#134276" },
    SUVs: { icon: "🚙", color: "#134276" },
    Hatchbacks: { icon: "🚘", color: "#134276" },
    "Luxury Cars": { icon: "🏎️", color: "#134276" },
    Electric: { icon: "⚡", color: "#134276" },
    "Budget Cars": { icon: "💰", color: "#134276" },
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("${}/api/categories")
        const backendCategories = response.data
        
        const formattedCategories = Object.keys(categoryStyles).map((name, index) => {
          const backendCategory = backendCategories.find((c) => c.name === name)
          return {
            id: index + 1,
            name,
            icon: categoryStyles[name].icon,
            color: categoryStyles[name].color,
            count: backendCategory ? backendCategory.count : 0,
          }
        })
        setCategories(formattedCategories)
        setLoading(false)
      } catch (err) {
        setError("Failed to load categories")
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    navigate(`/all-cars?category=${encodeURIComponent(categoryName)}`)
  }

  if (loading) {
    return (
      <section className="popular-categories-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Find Your Perfect Car</h2>
            <p className="section-subtitle">Browse our most popular categories</p>
          </div>
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="popular-categories-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Find Your Perfect Car</h2>
            <p className="section-subtitle">Browse our most popular categories</p>
          </div>
          <p style={{ color: "#ef4444", textAlign: "center" }}>{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="popular-categories-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Find Your Perfect Car</h2>
          <p className="section-subtitle">Browse our most popular categories</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category.name)}
              style={{ "--category-color": category.color }}
            >
              <div
                className="category-icon-wrapper"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <span className="category-icon-emoji">{category.icon}</span>
              </div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-count">{category.count} cars</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularCategories