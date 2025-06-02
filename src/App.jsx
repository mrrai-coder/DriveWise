import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import AllCars from "./pages/AllCars.jsx"
import About from "./components/About.jsx"
import CarRecommendation from "./components/CarRecommendation.jsx"
import ListCarForm from "./components/ListCarForm.jsx"
import "./App.css"
import { useState } from "react"

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token")
  return token ? element : <Navigate to="/" replace />
}

const AppRoutes = () => {
  const [listTrigger, setListTrigger] = useState(0)
  const navigate = useNavigate()

  const handleCarListed = () => {
    setListTrigger((prev) => prev + 1)
  }

  const handleCloseForm = () => {
    navigate("/all-cars")
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-cars" element={<AllCars onCarListed={listTrigger} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/car-recommendation"
          element={<ProtectedRoute element={<CarRecommendation />} />}
        />
        <Route
          path="/list-car"
          element={
            <ProtectedRoute
              element={
                <ListCarForm
                  isOpen={true}
                  onClose={handleCloseForm}
                  onCarListed={handleCarListed}
                />
              }
            />
          }
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App