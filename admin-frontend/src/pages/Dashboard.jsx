// src/pages/Dashboard.jsx
import React from 'react';
import LeftSection from '../components/LeftSection';
import BookList from '../components/BookList';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <LeftSection />
      <main>
        <h2>Welcome to the Admin Dashboard</h2>
        <BookList />
      </main>
    </div>
  );
};

export default Dashboard;
