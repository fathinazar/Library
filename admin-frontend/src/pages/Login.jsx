// src/pages/Login.jsx

import React, { useState } from 'react';
import axios from '../utils/axios'; // Use the custom axios instance
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/login', { username: email, password });
      localStorage.setItem('adminToken', response.data.token);
      window.location.href = '/'; // Redirect to the dashboard
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
