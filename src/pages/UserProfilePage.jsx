"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editCarOpen, setEditCarOpen] = useState(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmEditCarOpen, setConfirmEditCarOpen] = useState(null);
  const [confirmDeleteCarOpen, setConfirmDeleteCarOpen] = useState(null);
  const [confirmDeleteAccountOpen, setConfirmDeleteAccountOpen] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicError, setProfilePicError] = useState(false);
  const [carImageErrors, setCarImageErrors] = useState({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [carForm, setCarForm] = useState({});
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000";

  const getCarImage = (images, baseUrl) => {
    if (!images || !images.length) return "https://via.placeholder.com/150";
    return `${baseUrl}${images[0]}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view your profile", {
            position: "top-right",
            autoClose: 3000,
          });
          navigate("/login");
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setContactNumber(response.data.contactNumber || "");
        setFullName(response.data.fullName || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          navigate("/login");
        } else {
          toast.error(error.response?.data?.error || "Failed to load profile", {
            position: "top-right",
            autoClose: 3000,
          });
        }
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const validatePhoneNumber = (phone) => {
    const pattern = /^(\+92[0-9]{10}|0[0-9]{10})$/;
    return pattern.test(phone);
  };

  const handleEditUser = () => {
    if (contactNumber && !validatePhoneNumber(contactNumber)) {
      toast.error("Invalid phone number format. Use +923001234567 or 03001234567");
      return;
    }

    if (!contactNumber && !profilePicture && !fullName) {
      toast.error("Please provide at least one field to update");
      return;
    }

    setConfirmSaveOpen(true);
  };

  const confirmSaveUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      if (contactNumber) formData.append("contactNumber", contactNumber);
      if (fullName) formData.append("fullName", fullName);
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const response = await axios.put(`${BASE_URL}/api/update-user`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUserData({
        ...userData,
        fullName: fullName || userData.fullName,
        contactNumber: contactNumber || userData.contactNumber,
        profilePicture: response.data.profilePicture || userData.profilePicture,
      });
      setEditUserOpen(false);
      setConfirmSaveOpen(false);
      setProfilePicture(null);
      setProfilePicError(false);
      toast.success("User details updated successfully");
    } catch (error) {
      setConfirmSaveOpen(false);
      toast.error(error.response?.data?.error || "Failed to update user details");
    }
  };

  const handleEditCar = (carId) => {
    const parsedCarForm = {
      name: carForm.name || undefined,
      location: carForm.location || undefined,
      price: carForm.price ? parseFloat(carForm.price) : undefined,
      year: carForm.year ? parseInt(carForm.year, 10) : undefined,
      mileage: carForm.mileage ? parseInt(carForm.mileage, 10) : undefined,
      fuel: carForm.fuel || undefined,
      transmission: carForm.transmission || undefined,
      category: carForm.category || undefined,
      make: carForm.make || undefined,
      model: carForm.model || undefined,
      featured: carForm.featured !== undefined ? carForm.featured : undefined,
      newImages: carForm.newImages || undefined,
    };

    if (parsedCarForm.price && (isNaN(parsedCarForm.price) || parsedCarForm.price <= 0)) {
      toast.error("Price must be a valid positive number");
      return;
    }
    if (parsedCarForm.year && (isNaN(parsedCarForm.year) || parsedCarForm.year < 1900 || parsedCarForm.year > new Date().getFullYear())) {
      toast.error(`Year must be between 1900 and ${new Date().getFullYear()}`);
      return;
    }
    if (parsedCarForm.mileage && (isNaN(parsedCarForm.mileage) || parsedCarForm.mileage < 0)) {
      toast.error("Mileage must be a valid non-negative number");
      return;
    }

    const validCategories = ["Sedans", "SUVs", "Hatchbacks", "Luxury Cars", "Electric", "Budget Cars"];
    if (parsedCarForm.category && !validCategories.includes(parsedCarForm.category)) {
      toast.error(`Category must be one of: ${validCategories.join(", ")}`);
      return;
    }

    if (parsedCarForm.newImages) {
      const maxFileSize = 5 * 1024 * 1024;
      for (const file of parsedCarForm.newImages) {
        if (file.size > maxFileSize) {
          toast.error(`File ${file.name} exceeds 5MB limit`);
          return;
        }
        if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
          toast.error(`Invalid file type for ${file.name}. Allowed: jpg, jpeg, png, gif`);
          return;
        }
      }
    }

    const validFields = Object.keys(parsedCarForm).filter(
      (key) => parsedCarForm[key] !== undefined && (key !== "newImages" || parsedCarForm.newImages?.length > 0)
    );
    if (validFields.length === 0) {
      toast.error("Please provide at least one field to update");
      return;
    }

    setConfirmEditCarOpen(carId);
  };

  const confirmEditCar = async (carId) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      const excludedFields = ["id", "_id"];
      for (const key in carForm) {
        if (!excludedFields.includes(key) && carForm[key] !== undefined && carForm[key] !== "") {
          formData.append(key, carForm[key]);
        }
      }
      if (carForm.newImages && carForm.newImages.length > 0) {
        carForm.newImages.forEach((file) => formData.append("images", file));
      }

      console.log("FormData entries for car update:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      const response = await axios.put(`${BASE_URL}/api/update-car/${carId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedCar = await axios.get(`${BASE_URL}/api/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData({
        ...userData,
        cars: userData.cars.map((car) => (car._id === carId ? updatedCar.data : car)),
      });
      setEditCarOpen(null);
      setConfirmEditCarOpen(null);
      setCarForm({});
      setCarImageErrors({});
      toast.success("Car updated successfully");
    } catch (error) {
      console.error("Update car error:", error.response?.data, error.response?.status);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.error || "Failed to update car");
      }
      setConfirmEditCarOpen(null);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }
      if (newPassword.length < 8) {
        toast.error("New password must be at least 8 characters long");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChangePasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(response.data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.error || "Failed to change password");
      }
    }
  };

  const handleDeleteCar = (carId) => {
    console.log("Attempting to delete car with ID:", carId);
    setConfirmDeleteCarOpen(carId);
  };

  const confirmDeleteCar = async (carId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/delete-car/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData({
        ...userData,
        cars: userData.cars.filter((car) => car._id !== carId),
      });
      setCarImageErrors({});
      setConfirmDeleteCarOpen(null);
      toast.success("Car deleted successfully");
    } catch (error) {
      console.error("Delete car error:", error.response?.data, error.response?.status);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.error || "Failed to delete car");
      }
      setConfirmDeleteCarOpen(null);
    }
  };

  const handleDeleteAccount = () => {
    setConfirmDeleteAccountOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      setConfirmDeleteAccountOpen(false);
      toast.success("Account deleted successfully", {
        onClose: () => navigate("/"),
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.error || "Failed to delete account");
      }
      setConfirmDeleteAccountOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <i className="fa fa-spinner fa-spin"></i> Loading...
      </div>
    );
  }

  if (!userData) {
    return <div className="profile-error">Unable to load profile</div>;
  }

  return (
    <div className="site-wrapper">
      <Header />
      <main className="profile-section">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Your Profile</h1>
            <div className="breadcrumbs">
              <button onClick={() => navigate("/")}>Home</button> / Profile
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-details">
              <h2 className="section-title">User Information</h2>
              <div className="profile-card">
                <div className="profile-pic-wrapper">
                  <img
                    src={profilePicError || !userData.profilePicture ? "https://via.placeholder.com/100" : `${BASE_URL}${userData.profilePicture}`}
                    alt="Profile"
                    className="profile-picture"
                    onError={() => {
                      console.log("Profile pic URL:", `${BASE_URL}${userData.profilePicture}`);
                      setProfilePicError(true);
                    }}
                  />
                  <div
                    className="edit-pic-icon"
                    onClick={() => setEditUserOpen(true)}
                    title="Edit Profile Picture"
                  >
                    <i className="fa fa-pencil-alt"></i>
                  </div>
                </div>
                <p><strong>Name:</strong> {userData.fullName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Contact Number:</strong> {userData.contactNumber || "Not set"}</p>
                <div className="profile-actions">
                  <button className="btn btn-primary" onClick={() => setEditUserOpen(true)}>
                    Edit Profile
                  </button>
                  <button className="btn btn-primary" onClick={() => setChangePasswordOpen(true)}>
                    Change Password
                  </button>
                  <button className="btn btn-error" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            <div className="profile-cars">
              <h2 className="section-title">Your Car Listings</h2>
              {userData.cars.length === 0 ? (
                <p>No cars listed yet.</p>
              ) : (
                <div className="car-grid">
                  {userData.cars.map((car) => (
                    <div key={car._id} className="car-card">
                      <div className="car-image-container">
                        <img
                          src={carImageErrors[car._id] ? "https://via.placeholder.com/150" : getCarImage(car.images, BASE_URL)}
                          alt={car.name}
                          className="car-image"
                          onError={() => {
                            console.log("Car image URL:", car.images && car.images.length ? `${BASE_URL}${car.images[0]}` : "No valid image");
                            setCarImageErrors((prev) => ({ ...prev, [car._id]: true }));
                          }}
                        />
                        {car.featured && <span className="featured-tag">Featured</span>}
                      </div>
                      <div className="car-details">
                        <h3 className="car-title">{car.name}</h3>
                        <p className="car-location">{car.location}</p>
                        <div className="car-price-row">
                          <span className="car-price">PKR {car.price.toLocaleString()}</span>
                          <span className="car-posted">{car.postedDays} days ago</span>
                        </div>
                        <div className="car-specs">
                          <div className="car-spec">
                            <span className="spec-label">Year:</span>
                            <span className="spec-value">{car.year}</span>
                          </div>
                          <div className="car-spec">
                            <span className="spec-label">Mileage:</span>
                            <span className="spec-value">{car.mileage} km</span>
                          </div>
                          <div className="car-spec">
                            <span className="spec-label">Fuel:</span>
                            <span className="spec-value">{car.fuel}</span>
                          </div>
                          <div className="car-spec">
                            <span className="spec-label">Transmission:</span>
                            <span className="spec-value">{car.transmission}</span>
                          </div>
                        </div>
                        <div className="car-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              const carFormData = {
                                name: car.name,
                                location: car.location,
                                price: car.price,
                                year: car.year,
                                mileage: car.mileage,
                                fuel: car.fuel,
                                transmission: car.transmission,
                                category: car.category,
                                make: car.make,
                                model: car.model,
                                featured: car.featured,
                              };
                              console.log("Setting carForm:", carFormData);
                              setCarForm(carFormData);
                              setEditCarOpen(car._id);
                            }}
                          >
                            Edit Listing
                          </button>
                          <button
                            className="btn btn-error"
                            onClick={() => handleDeleteCar(car._id)}
                          >
                            Delete Listing
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {editUserOpen && (
        <div className="modal-overlay" onClick={() => setEditUserOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button className="close-btn" onClick={() => setEditUserOpen(false)} title="Close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g., +923001234567 or 03001234567"
                />
              </div>
              <div className="form-group">
                <label htmlFor="profilePicture">Profile Picture</label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/png,image/jpeg,image/gif"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("Profile picture exceeds 5MB limit");
                        return;
                      }
                      if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
                        toast.error("Invalid file type. Allowed: jpg, jpeg, png, gif");
                        return;
                      }
                      setProfilePicture(file);
                    }
                  }}
                />
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={handleEditUser}>
                  Save
                </button>
                <button className="btn btn-outline" onClick={() => setEditUserOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editCarOpen && (
        <div className="modal-overlay" onClick={() => setEditCarOpen(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Car Listing</h2>
              <button className="close-btn" onClick={() => setEditCarOpen(null)} title="Close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="carName">Car Name</label>
                <input
                  type="text"
                  id="carName"
                  value={carForm.name || ""}
                  onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  value={carForm.location || ""}
                  onChange={(e) => setCarForm({ ...carForm, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price (PKR)</label>
                <input
                  type="number"
                  id="price"
                  value={carForm.price || ""}
                  onChange={(e) => setCarForm({ ...carForm, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  value={carForm.year || ""}
                  onChange={(e) => setCarForm({ ...carForm, year: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mileage">Mileage (km)</label>
                <input
                  type="number"
                  id="mileage"
                  value={carForm.mileage || ""}
                  onChange={(e) => setCarForm({ ...carForm, mileage: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="fuel">Fuel Type</label>
                <select
                  id="fuel"
                  value={carForm.fuel || ""}
                  onChange={(e) => setCarForm({ ...carForm, fuel: e.target.value })}
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="transmission">Transmission</label>
                <select
                  id="transmission"
                  value={carForm.transmission || ""}
                  onChange={(e) => setCarForm({ ...carForm, transmission: e.target.value })}
                >
                  <option value="">Select Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={carForm.category || ""}
                  onChange={(e) => setCarForm({ ...carForm, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="Sedans">Sedans</option>
                  <option value="SUVs">SUVs</option>
                  <option value="Hatchbacks">Hatchbacks</option>
                  <option value="Luxury Cars">Luxury Cars</option>
                  <option value="Electric">Electric</option>
                  <option value="Budget Cars">Budget Cars</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="make">Make</label>
                <input
                  type="text"
                  id="make"
                  value={carForm.make || ""}
                  onChange={(e) => setCarForm({ ...carForm, make: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  value={carForm.model || ""}
                  onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="featured">Featured</label>
                <input
                  type="checkbox"
                  id="featured"
                  checked={carForm.featured || false}
                  onChange={(e) => setCarForm({ ...carForm, featured: e.target.checked })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newImages">New Images</label>
                <input
                  type="file"
                  id="newImages"
                  accept="image/png,image/jpeg,image/gif"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setCarForm({ ...carForm, newImages: files });
                  }}
                />
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => handleEditCar(editCarOpen)}>
                  Save
                </button>
                <button className="btn btn-outline" onClick={() => setEditCarOpen(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmSaveOpen && (
        <div className="modal-overlay">
          <div className="success-modal-container">
            <div className="success-modal-content">
              <span className="success-icon">✔</span>
              <h3 className="success-title">Are you sure?</h3>
              <p className="success-message">Do you want to save these changes to your profile?</p>
              <div className="modal-actions">
                <button className="btn btn-primary success-button" onClick={confirmSaveUser}>
                  Yes, Save
                </button>
                <button className="btn btn-outline" onClick={() => setConfirmSaveOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmEditCarOpen && (
        <div className="modal-overlay">
          <div className="success-modal-container">
            <div className="success-modal-content">
              <span className="success-icon">✔</span>
              <h3 className="success-title">Confirm Car Update</h3>
              <p className="success-message">Do you want to save these changes to your car listing?</p>
              <div className="modal-actions">
                <button className="btn btn-primary success-button" onClick={() => confirmEditCar(confirmEditCarOpen)}>
                  Yes, Save
                </button>
                <button className="btn btn-outline" onClick={() => setConfirmEditCarOpen(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteCarOpen && (
        <div className="modal-overlay">
          <div className="success-modal-container">
            <div className="success-modal-content">
              <span className="success-icon">⚠</span>
              <h3 className="success-title">Confirm Deletion</h3>
              <p className="success-message">Are you sure you want to delete this car listing? This action is irreversible.</p>
              <div className="modal-actions">
                <button className="btn btn-error success-button" onClick={() => confirmDeleteCar(confirmDeleteCarOpen)}>
                  Yes, Delete
                </button>
                <button className="btn btn-outline" onClick={() => setConfirmDeleteCarOpen(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteAccountOpen && (
        <div className="modal-overlay">
          <div className="success-modal-container">
            <div className="success-modal-content">
              <span className="success-icon">⚠</span>
              <h3 className="success-title">Confirm Account Deletion</h3>
              <p className="success-message">Are you sure you want to delete your account? This action is irreversible.</p>
              <div className="modal-actions">
                <button className="btn btn-error success-button" onClick={confirmDeleteAccount}>
                  Yes, Delete
                </button>
                <button className="btn btn-outline" onClick={() => setConfirmDeleteAccountOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {changePasswordOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="close-btn" onClick={() => setChangePasswordOpen(false)} title="Close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={handleChangePassword}>
                  Save
                </button>
                <button className="btn btn-outline" onClick={() => setChangePasswordOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default UserProfilePage;