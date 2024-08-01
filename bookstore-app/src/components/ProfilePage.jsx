import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeftSection from './LeftSection';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    place: '',
    age: '',
    email: '',
    education: '',
    address: '',
    phoneNumber: '',
  });

  const [originalProfile, setOriginalProfile] = useState({});
  const [errors, setErrors] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'x-auth-token': token,
          },
        });
        setProfile(response.data);
        setOriginalProfile(response.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProfile();
  }, []);

  const validate = () => {
    const errors = {};

    if (!profile.name) errors.name = 'Name is required';
    if (!profile.place) errors.place = 'Place is required';
    if (!profile.age) errors.age = 'Age is required';
    if (!profile.email) errors.email = 'Email is required';
    if (!profile.education) errors.education = 'Education is required';
    if (!profile.address) errors.address = 'Address is required';
    if (!profile.phoneNumber) errors.phoneNumber = 'Phone Number is required';

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    if (value !== originalProfile[name]) {
      setIsChanged(true);
    } else {
      setIsChanged(Object.keys(profile).some((key) => profile[key] !== originalProfile[key]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          'http://localhost:5000/api/users/profile',
          profile,
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        setOriginalProfile(profile);
        setIsChanged(false);
        alert('Profile updated successfully!');
      } catch (err) {
        console.error(err.message);
        alert('Error updating profile. Please try again.');
      }
    }
  };

  return (
    <div className="profile-page">
      <div className="main-content">
        <LeftSection />
        <div className="profile-details">
          <h1>Profile Page</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="place">Place</label>
              <input
                type="text"
                id="place"
                name="place"
                value={profile.place}
                onChange={handleChange}
              />
              {errors.place && <span className="error">{errors.place}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={profile.age}
                onChange={handleChange}
              />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="education">Education</label>
              <input
                type="text"
                id="education"
                name="education"
                value={profile.education}
                onChange={handleChange}
              />
              {errors.education && <span className="error">{errors.education}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleChange}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
            </div>
            <button type="submit" disabled={!isChanged} className={isChanged ? 'active' : 'disabled'}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
