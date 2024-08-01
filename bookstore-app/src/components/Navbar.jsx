import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css'; // Import CSS for styling

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  const confirmLogout = () => {
    onLogout(); // Trigger the logout action
    setShowConfirmLogout(false);
    setShowLogoutAlert(true);
    navigate('/'); // Redirect to home page

    setTimeout(() => {
      setShowLogoutAlert(false);
    }, 5000); // Hide alert after 5 seconds
  };

  const cancelLogout = () => {
    setShowConfirmLogout(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <h1>
            <FaBook className="navbar-icon" /> Bookstore
          </h1>
        </div>
        <div className="navbar-right">
          {isAuthenticated ? (
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="navbar-icon" /> Logout
            </button>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>

      {showConfirmLogout && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <button onClick={confirmLogout}>Yes</button>
            <button onClick={cancelLogout}>No</button>
          </div>
        </div>
      )}

      {showLogoutAlert && (
        <div className="logout-alert">
          <p>Logged out successfully</p>
        </div>
      )}
    </>
  );
};

export default Navbar;
