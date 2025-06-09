import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HeroSection = ({ navigate }) => {
  const reactNavigate = useNavigate();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [error, setError] = useState("");

  const handleSearchClick = () => {
    setShowSearchInput(!showSearchInput);
    setError("");
    setSearchName("");
  };

  const handleInputChange = (e) => {
    setSearchName(e.target.value);
    setError("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!searchName.trim()) {
      setError("Please enter a car name.");
      return;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("name", searchName.trim());

      const queryString = queryParams.toString();
      const navigateTo = `/all-cars?${queryString}`;

      if (navigate) {
        navigate("all-cars", { state: { query: queryString } });
      } else {
        reactNavigate(navigateTo);
      }
      window.scrollTo(0, 0);
      setShowSearchInput(false); // Hide input after submission
      setSearchName("");
    } catch (err) {
      setError("Failed to initiate search. Please try again.");
    }
  };

  const handleFindOutMore = (e) => {
    e.preventDefault();
    if (navigate) {
      navigate("about");
    } else {
      reactNavigate("/about");
    }
    window.scrollTo(0, 0);
  };

  return (
    <section className="hero-section">
      <div className="hero-bg"></div>
      <div className="container">
        <div className="hero-content">
          <h1 className="title">
            The Best Online Platform <span className="block-md-inline">to Buy Your Next Car</span>
          </h1>
          <div className="divider"></div>
          <p className="description">Find your perfect car quicker than ever.</p>

          <div className="hero-actions" style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button
              className="btn btn-primary"
              onClick={handleSearchClick}
              style={{ padding: "0.9rem 1.5rem" }}
            >
              <i className="fa fa-search"></i> SEARCH CAR
            </button>
            <a href="#" className="btn-text" onClick={handleFindOutMore}>
              Find out more <i className="fa fa-arrow-right"></i>
            </a>
          </div>

          {showSearchInput && (
            <form
              onSubmit={handleSearchSubmit}
              className="search-form"
              style={{ marginTop: "1rem", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}
            >
              <div className="search-input-group" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <input
                  type="text"
                  name="name"
                  value={searchName}
                  onChange={handleInputChange}
                  placeholder="Enter car name (e.g., Toyota Corolla)"
                  className="form-select"
                  style={{ flex: 1, padding: "0.9rem" }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: "0.9rem 1.5rem" }}
                >
                  Submit
                </button>
              </div>
              {error && (
                <p style={{ color: "#ef4444", textAlign: "center", marginTop: "1rem" }}>{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;