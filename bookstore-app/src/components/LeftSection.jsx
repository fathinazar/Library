// src/components/LeftSection.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaInfoCircle } from 'react-icons/fa'; // Import FaInfoCircle for About Us icon
import './LeftSection.css'; // Import CSS for styling

const LeftSection = () => {
  const location = useLocation();

  return (
    <div className="left-section">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        <FaHome className="icon" />
        Home
      </Link>
      <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
        <FaUser className="icon" />
        Profile
      </Link>
      <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
        <FaInfoCircle className="icon" />
        About
      </Link>
    </div>
  );
};

export default LeftSection;
