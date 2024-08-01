import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css'; // Import CSS for styling

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img src={`http://localhost:5000${book.image}`} alt={book.title} className="book-image" />
      <div className="book-details-bookcard">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">Author: {book.author}</p>
        <p className="book-genre">Genre: {book.genre}</p>
        <p className="book-publication-year">Publication Year: {book.publicationYear}</p>
        <Link to={`/book/${book._id}`} className="learn-more">Learn More</Link>
      </div>
    </div>
  );
};

export default BookCard;
