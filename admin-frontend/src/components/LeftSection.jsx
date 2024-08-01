// src/components/LeftSection.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LeftSection.css';

const LeftSection = () => {
  const location = useLocation();

  return (
    <div className="left-section">
      <nav>
        <ul>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Dashboard</Link>
          </li>
          <li className={location.pathname === '/add-book' ? 'active' : ''}>
            <Link to="/add-book">Add Book</Link>
          </li>
          <li className={location.pathname === '/users' ? 'active' : ''}>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LeftSection;
