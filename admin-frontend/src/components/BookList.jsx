import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/admin/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleStatusChange = async (id, status) => {
    const confirmMessage = status
      ? 'Are you sure you want to mark this book as available?'
      : 'Are you sure you want to mark this book as not available?';

    if (window.confirm(confirmMessage)) {
      try {
        await axios.put(`/admin/books/${id}/status`, { isAvailable: status });
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book._id === id ? { ...book, isAvailable: status } : book))
        );
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/admin/books/${id}`);
        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleEditClick = (book) => {
    setBookToEdit(book);
    setImagePreview(book.image ? `http://localhost:5000${book.image}` : null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setBookToEdit(null);
    setImagePreview(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(bookToEdit ? `http://localhost:5000${bookToEdit.image}` : null);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedBookData = Object.fromEntries(formData.entries());

    if (bookToEdit) {
      try {
        const response = await axios.put(`/admin/books/${bookToEdit._id}/details`, updatedBookData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setBooks((prevBooks) =>
          prevBooks.map((book) => (book._id === bookToEdit._id ? response.data : book))
        );
        handleModalClose();
      } catch (error) {
        console.error('Error updating book:', error);
      }
    }
  };

  return (
    <div className="book-list">
      <h3>Book List</h3>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Rental Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>
                {book.image && (
                  <img src={`http://localhost:5000${book.image}`} alt={book.title} className="book-image" />
                )}
              </td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.isAvailable ? 'Available' : 'Not Available'}</td>
              <td>
                <div className="dropdown">
                  <button className="dropbtn">Actions</button>
                  <div className="dropdown-content">
                    <button onClick={() => handleStatusChange(book._id, !book.isAvailable)}>
                      {book.isAvailable ? 'Mark as Not Available' : 'Mark as Available'}
                    </button>
                    <button onClick={() => handleDelete(book._id)}>Delete</button>
                    <button onClick={() => handleEditClick(book)}>Edit</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && bookToEdit && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <form onSubmit={handleFormSubmit}>
              <label>
                Title:
                <input type="text" name="title" defaultValue={bookToEdit.title} required />
              </label>
              <label>
                Author:
                <input type="text" name="author" defaultValue={bookToEdit.author} required />
              </label>
              <label>
                Genre:
                <input type="text" name="genre" defaultValue={bookToEdit.genre} required />
              </label>
              <label>
                Publication Year:
                <input type="number" name="publicationYear" defaultValue={bookToEdit.publicationYear} required />
              </label>
              <label>
                ISBN:
                <input type="text" name="isbn" defaultValue={bookToEdit.isbn} required />
              </label>
              <label>
                Description:
                <textarea name="description" defaultValue={bookToEdit.description} required></textarea>
              </label>
              <label>
                Current Image:
                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
              </label>
              <label>
                New Image:
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
              </label>
              <label>
                Available:
                <input type="checkbox" name="isAvailable" defaultChecked={bookToEdit.isAvailable} />
              </label>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
