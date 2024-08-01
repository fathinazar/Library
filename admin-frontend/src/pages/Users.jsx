import React, { useState, useEffect } from 'react';
import axios from '../utils/axios'; // Use the custom axios instance
import LeftSection from '../components/LeftSection';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend using the custom axios instance
    axios.get('/admin/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleBlockToggle = (id, isBlocked) => {
    // Block/unblock user using the custom axios instance
    axios.put(`/admin/users/${id}/block`)
      .then(response => {
        setUsers(users.map(user => user._id === id ? { ...user, isBlocked: !isBlocked } : user));
      })
      .catch(error => {
        console.error('Error blocking/unblocking user:', error);
      });
  };

  return (
    <div className="users-page">
      <LeftSection />
      <div className="users-container">
        <h1>All Users</h1>
        <div className="users-list">
          {users.map(user => (
            <div key={user._id} className="user-card">
              <h3>{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phoneNumber}</p>
              <button className="block-button" onClick={() => handleBlockToggle(user._id, user.isBlocked)}>
                {user.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
