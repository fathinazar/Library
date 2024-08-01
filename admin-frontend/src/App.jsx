import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AddBook from './pages/AddBook';
import Users from './pages/Users'; // Import the Users component
import PrivateRoute from './PrivateRoute';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-book" element={<PrivateRoute><AddBook /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} /> {/* Add the route for Users */}
      </Routes>
    </div>
  );
};

export default App;
