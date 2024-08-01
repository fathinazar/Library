import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const handleLogout = () => {
    if(window.confirm('Are you sure you want to logout?')){

      localStorage.removeItem('adminToken');
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <h1>Admin Dashboard</h1>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
