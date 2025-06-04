"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "./UserProfilePage.css"

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [editCarOpen, setEditCarOpen] = useState(null)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false)
  const [contactNumber, setContactNumber] = useState("")
  const [fullName, setFullName] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)
  const [profilePicError, setProfilePicError] = useState(false)
  const [carImageErrors, setCarImageErrors] = useState({})
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [carForm, setCarForm] = useState({})
  const navigate = useNavigate()

  const BASE_URL = "http://localhost:5000"

  // Utility function to get car image with fallback
  const getCarImage = (images, baseUrl) => {
    if (!images || !images.length) return "https://via.placeholder.com/150"
    return `${baseUrl}${images[0]}`
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          toast.error("Please log in to view your profile", {
            position: "top-right",
            autoClose: 3000,
          })
          navigate("/login")
          return
        }

        const response = await axios.get(`${BASE_URL}/api/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("Fetched user data:", response.data) // Log for debugging
        setUserData(response.data)
        setContactNumber(response.data.contactNumber || "")
        setFullName(response.data.fullName || "")
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data)
        setIsLoading(false)
        toast.error(error.response?.data?.error || "Failed to load profile", {
          position: "top-right",
          autoClose: 3000,
        })
      }
    }
    fetchProfile()
  }, [navigate])

  const validatePhoneNumber = (phone) => {
    const pattern = /^(\+92[0-9]{10}|0[0-9]{10})$/
    return pattern.test(phone)
  }

  const handleEditUser = () => {
    if (contactNumber && !validatePhoneNumber(contactNumber)) {
      toast.error("Invalid phone number format. Use +923001234567 or 03001234567", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    if (!contactNumber && !profilePicture && !fullName) {
      toast.error("Please provide at least one field to update", {
        position: "top-right",
        autoClose: 3000,
      })
      return
    }

    setConfirmSaveOpen(true)
  }

  const confirmSaveUser = async () => {
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      if (contactNumber) formData.append("contactNumber", contactNumber)
      if (fullName) formData.append("fullName", fullName)
      if (profilePicture) formData.append("profilePicture", profilePicture)

      const response = await axios.put(`${BASE_URL}/api/update-user`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      setUserData({
        ...userData,
        fullName: fullName || userData.fullName,
        contactNumber: contactNumber || userData.contactNumber,
        profilePicture: response.data.profilePicture || userData.profilePicture,
      })
      setEditUserOpen(false)
      setConfirmSaveOpen(false)
      setProfilePicture(null)
      setProfilePicError(false)
      toast.success("User details updated successfully", {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      setConfirmSaveOpen(false)
      toast.error(error.response?.data?.error || "Failed to update user details", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  const handleEditCar = async (carId) => {
    try {
      if (carForm.price && isNaN(carForm.price)) {
        toast.error("Price must be a valid number", {
          position: "top-right",
          autoClose: 3000,
        })
        return
      }
      if (carForm.year && (isNaN(carForm.year) || carForm.year < 1900 || carForm.year > new Date().getFullYear())) {
        toast.error("Year must be a valid number between 1900 and current year", {
          position: "top-right",
          autoClose: 3000,
        })
        return
      }
      if (carForm.mileage && (isNaN(carForm.mileage) || carForm.mileage < 0)) {
        toast.error("Mileage must be a valid non-negative number", {
          position: "top-right",
          autoClose: 3000,
        })
        return
      }

      const token = localStorage.getItem("token")
      const formData = new FormData()
      for (const key in carForm) {
        if (carForm[key] && key !== "newImages") formData.append(key, carForm[key])
      }
      if (carForm.newImages) {
        carForm.newImages.forEach((file) => formData.append("images", file))
      }

      if (!Object.keys(carForm).length) {
        toast.error("Please provide at least one field to update", {
          position: "top-right",
          autoClose: 3000,
        })
        return
      }

      await axios.put(`${BASE_URL}/api/update-car/${carId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      const updatedCar = await axios.get(`${BASE_URL}/api/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUserData({
        ...userData,
        cars: userData.cars.map((car) => (car._id === carId ? updatedCar.data : car)),
      })
      setEditCarOpen(null)
      setCarForm({})
      setCarImageErrors({})
      toast.success("Car updated successfully", {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update car", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match", {
          position: "top-right",
          autoClose: 3000,
        })
        return
      }
      if (newPassword.length < 8) {
        toast.error("New password must be at least 8 characters long", {
          position: "top-right",
          autoClose: 3000,
        })
        return
      }

      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${BASE_URL}/api/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setChangePasswordOpen(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to change password", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car listing?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${BASE_URL}/api/delete-car/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUserData({
        ...userData,
        cars: userData.cars.filter((car) => car._id !== carId),
      })
      setCarImageErrors({})
      toast.success("Car deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete car", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${BASE_URL}/api/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      localStorage.removeItem("token")
      toast.success("Account deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      })
      navigate("/")
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete account", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="profile-loading">
        <i className="fa fa-spinner fa-spin"></i> Loading...
      </div>
    )
  }

  if (!userData) {
    return <div className="profile-error">Unable to load profile</div>
  }

  return (
    <div className="page-wrapper">
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
                      console.log("Profile pic URL:", `${BASE_URL}${userData.profilePicture}`)
                      setProfilePicError(true)
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
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditUserOpen(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setChangePasswordOpen(true)}
                  >
                    Change Password
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={handleDeleteAccount}
                  >
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
                            console.log("Car image URL:", car.images && car.images.length ? `${BASE_URL}${car.images[0]}` : "No valid image")
                            setCarImageErrors((prev) => ({ ...prev, [car._id]: true }))
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
                              setEditCarOpen(car._id)
                              setCarForm({
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
                              })
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

      {/* Edit User Modal */}
      {editUserOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <div className="form-group">
              <label for="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label for="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g., +923001234567 or 03001234567"
              />
            </div>
            <div className="form-group">
              <label for="profilePicture">Profile Picture</label>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
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
      )}

      {/* Confirm Save Modal */}
      {confirmSaveOpen && (
        <div className="modal">
          <div className="modal-content confirm-modal">
            <h3>Are you sure?</h3>
            <p>Do you want to save these changes to your profile?</p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={confirmSaveUser}>
                Yes, Save
              </button>
              <button className="btn btn-outline" onClick={() => setConfirmSaveOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {editCarOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Car Listing</h2>
            <div className="form-group">
              <label for="name">Car Name</label>
              <input
                type="text"
                id="name"
                value={carForm.name || ""}
                onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label for="location">Location</label>
              <input
                type="text"
                id="location"
                value={carForm.location || ""}
                onChange={(e) => setCarForm({ ...carForm, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label for="price">Price (PKR)</label>
              <input
                type="number"
                id="price"
                value={carForm.price || ""}
                onChange={(e) => setCarForm({ ...carForm, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label for="year">Year</label>
              <input
                type="number"
                id="year"
                value={carForm.year || ""}
                onChange={(e) => setCarForm({ ...carForm, year: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label for="mileage">Mileage (km)</label>
              <input
                type="number"
                id="mileage"
                value={carForm.mileage || ""}
                onChange={(e) => setCarForm({ ...carForm, mileage: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label for="fuel">Fuel Type</label>
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
              <label for="transmission">Transmission</label>
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
              <label for="category">Category</label>
              <input
                type="text"
                id="category"
                value={carForm.category || ""}
                onChange={(e) => setCarForm({ ...carForm, category: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label for="make">Make</label>
              <input
                type="text"
                id="make"
                value={carForm.make || ""}
                onChange={(e) => setCarForm({ ...carForm, make: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label for="model">Model</label>
              <input
                type="text"
                id="model"
                value={carForm.model || ""}
                onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label for="featured">Featured</label>
              <input
                type="checkbox"
                id="featured"
                checked={carForm.featured || false}
                onChange={(e) => setCarForm({ ...carForm, featured: e.target.checked })}
              />
            </div>
            <div className="form-group">
              <label for="images">Images</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={(e) => setCarForm({ ...carForm, newImages: Array.from(e.target.files) })}
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
      )}

      {/* Change Password Modal */}
      {changePasswordOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Change Password</h2>
            <div className="form-group">
              <label for="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label for="confirmPassword">Confirm Password</label>
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
      )}
      <Footer />
    </div>
  )
}

export default UserProfilePage