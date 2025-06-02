"use client"
import { useNavigate } from "react-router-dom"

const PopularCategories = ({ navigate }) => {
  const reactNavigate = useNavigate()

  // Categories data
  const categories = [
    {
      id: 1,
      name: "Sedans",
      icon: "🚗",
      count: 24,
      color: "#134276", 
    },
    {
      id: 2,
      name: "SUVs",
      icon: "🚙",
      count: 89,
      color: "#134276", 
    },
    {
      id: 3,
      name: "Hatchbacks",
      icon: "🚘",
      count: 56,
      color: "#134276", 
    },
    {
      id: 4,
      name: "Luxury Cars",
      icon: "🏎️",
      count: 32,
      color: "#134276", 
    },
    {
      id: 5,
      name: "Electric",
      icon: "⚡",
      count: 18,
      color: "#134276", 
    },
    {
      id: 6,
      name: "Budget Cars",
      icon: "💰",
      count: 76,
      color: "#134276", 
    },
  ]

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    // Use React Router navigation
    reactNavigate("/all-cars")

    // If using state-based navigation (backward compatibility)
    if (navigate) {
      navigate("all-cars")
    }

    // You could also pass the category as a filter parameter
    console.log(`Selected category: ${categoryName}`)
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
                style={{ backgroundColor: `${category.color}20` }} // 20 is hex for 12% opacity
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
