import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AllCars from "./pages/AllCars";
import About from "./pages/About";
import CarDetails from "./pages/CarDetails";
import SellCarPage from "./pages/SellCarPage";
import CarRecommendationPage from "./pages/CarRecommendationPage";
import UserProfilePage from "./pages/UserProfilePage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/all-cars" element={<AllCars />} />
          <Route path="/about" element={<About />} />
          <Route path="/cars/:carId" element={<CarDetails />} />
          <Route path="/sell-car" element={<SellCarPage />} />
          <Route path="/recommend" element={<CarRecommendationPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="*" element={<div><h1>404 - Page Not Found</h1><button onClick={() => window.location.href="/"}>Go Home</button></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;