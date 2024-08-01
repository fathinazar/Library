
// src/components/AboutUs.jsx
import React from 'react';
import './AboutUs.css'; // Import CSS for styling
import LeftSection from './LeftSection'; // Import LeftSection component

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <LeftSection />
      <div className="about-us-content">
        <h1>About Us</h1>
        <p>Welcome to our Bookstore! We are dedicated to providing a wide range of books to cater to the diverse interests of our readers. Whether you are looking for the latest bestsellers, classic literature, or educational resources, we have something for everyone.</p>
        <p>Our mission is to promote reading and lifelong learning by offering a curated selection of high-quality books. Our knowledgeable staff is always ready to help you find the perfect book and provide recommendations based on your preferences.</p>
        <p>Thank you for choosing our bookstore. We hope you have a wonderful experience exploring our collection and discovering new favorites.</p>
      </div>
    </div>
  );
};

export default AboutUs;
