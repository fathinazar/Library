import React, { useState, useEffect } from 'react';
import LeftSection from './LeftSection';
import BookCard from './BookCard';
import './HomePage.css'; // Import CSS for styling
import axios from 'axios'; // Import axios for making HTTP requests

const HomePage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch books from the backend
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        console.log('Fetched books:', response.data); // Log the response data
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <LeftSection />
      <main>
        <header>
          <h1>Welcome to the Bookstore</h1>
        </header>
        <section>
          <h2>New Arrivals</h2>
          <div className="book-list">
            {Array.isArray(books) && books.length > 0 ? (
              books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))
            ) : (
              <p>No books available</p>
            )}
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
