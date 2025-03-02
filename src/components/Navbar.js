import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../App";
import "./Navbar.css";

function Navbar() {
  const { cart, logout } = useContext(CartContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false); // State for popup

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleLogoutClick = () => {
    setIsLogoutPopupOpen(true); // Show popup instead of logging out immediately
  };

  const confirmLogout = () => {
    logout(); // Call the logout function from context
    setIsLogoutPopupOpen(false); // Close popup
    setIsProfileOpen(false); // Close dropdown
  };

  const cancelLogout = () => {
    setIsLogoutPopupOpen(false); // Close popup without logging out
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/shop" className="nav-link">Shop</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
      <div className="navbar-right">
        <div className="navbar-cart">
          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛒</span>
            {cart.length > 0 && (
              <span className="cart-count">{cart.length}</span>
            )}
          </Link>
        </div>
        <div className="navbar-profile">
          <span className="profile-icon" onClick={toggleProfileDropdown}>👤</span>
          {isProfileOpen && (
            <div className="profile-dropdown">
              <button className="logout-btn" onClick={handleLogoutClick}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {isLogoutPopupOpen && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <h3>Are you sure?</h3>
            <p>Do you really want to log out?</p>
            <div className="popup-buttons">
              <button className="confirm-btn" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="cancel-btn" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;