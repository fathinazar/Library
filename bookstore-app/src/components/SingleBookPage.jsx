import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LeftSection from './LeftSection';
import { FaThumbsUp } from 'react-icons/fa';
import './SingleBookPage.css';

const SingleBookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [liked, setLiked] = useState(false);
  const [userComment, setUserComment] = useState('');
  const [bookComments, setBookComments] = useState([]);
  const [user, setUser] = useState(null);
  const [rentedBook, setRentedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setUser(userResponse.data);

        // Fetch book data
        const bookResponse = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(bookResponse.data);
        setBookComments(bookResponse.data.comments || []);

        // Check if user liked the book
        if (userResponse.data && bookResponse.data.likedBy.includes(userResponse.data.email)) {
          setLiked(true);
        }

        // Fetch rented book data
        try {
          const rentedResponse = await axios.get(`http://localhost:5000/api/rented-books/${id}`, {
            headers: {
              'x-auth-token': localStorage.getItem('token'),
            },
          });
          setRentedBook(rentedResponse.data);
        } catch (rentedError) {
          if (rentedError.response && rentedError.response.status === 404) {
            setRentedBook(null);
          } else {
            throw rentedError;
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/books/${id}/${liked ? 'unlike' : 'like'}`,
        {
          email: user.email
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      setBook({ ...book, likes: response.data.likes });
      setLiked(!liked);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleCommentChange = (e) => {
    setUserComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/books/${id}/comments`,
        {
          email: user.email,
          text: userComment
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      setBookComments([...bookComments, response.data]);
      setUserComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleRent = async () => {
    if (window.confirm('Do you want to rent this book?')) {
      try {
        const response = await axios.post(`http://localhost:5000/api/books/${id}/rent`, {}, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setRentedBook(response.data);
        setBook({ ...book, isAvailable: false });
      } catch (error) {
        console.error('Error renting the book:', error);
      }
    }
  };

  const handleReturn = async () => {
    if (window.confirm('Do you want to return this book?')) {
      try {
        const response = await axios.post(`http://localhost:5000/api/books/${id}/return`, {}, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setRentedBook(null);
        setBook({ ...book, isAvailable: true });
      } catch (error) {
        console.error('Error returning the book:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="single-book-page">
      <div className="main-content">
        <LeftSection />
        <div className="book-details">
          <h1>{book.title}</h1>
          <div className="book-image-container">
            <img src={`http://localhost:5000${book.image}`} alt={book.title} className="book-image" />
          </div>
          <p className="book-author">Author: {book.author}</p>
          <p className="book-publication-year">Publication Year: {book.publicationYear}</p>
          <p className="book-genre">Genre: {book.genre}</p>
          <p className="book-isbn">ISBN: {book.isbn}</p>
          <p className="book-availability">
            Availability: {book.isAvailable ? 'Available' : 'Rented'}
          </p>
          <div className="book-actions">
            <button
              className={`like-button ${liked ? 'active' : ''}`}
              onClick={handleLike}
              disabled={!user} // Disable button if user is not loaded yet
            >
              <FaThumbsUp /> {book.likes} Like
            </button>
            {user && (
              <>
                {rentedBook && rentedBook.user === user._id && rentedBook.isActive ? (
                  <button onClick={handleReturn}>
                    Return
                  </button>
                ) : (
                  <button onClick={handleRent} disabled={!book.isAvailable}>
                    Rent
                  </button>
                )}
              </>
            )}
          </div>
          <p className="book-description">{book.description}</p>
          <div className="comments-section">
            <h2>Comments</h2>
            <div className="comments-list">
              {bookComments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p className="comment-email">{comment.email}</p>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <textarea
                value={userComment}
                onChange={handleCommentChange}
                placeholder="Add your comment..."
                rows="4"
              />
              <button type="submit" disabled={!user}>Submit Comment</button> {/* Disable button if user is not loaded yet */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBookPage;
