// src/pages/AddBook.jsx
import React, { useState } from 'react';
import axios from '../utils/axios'; // Use the custom axios instance
import './AddBook.css';
import LeftSection from '../components/LeftSection';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required';
    if (!author) newErrors.author = 'Author is required';
    if (!genre) newErrors.genre = 'Genre is required';
    if (!publicationYear) newErrors.publicationYear = 'Publication year is required';
    if (!isbn) newErrors.isbn = 'ISBN is required';
    if (!description) newErrors.description = 'Description is required';
    if (!image) newErrors.image = 'Book image is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('genre', genre);
    formData.append('publicationYear', publicationYear);
    formData.append('isbn', isbn);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('isAvailable', isAvailable);

    try {
      const response = await axios.post('/admin/add-books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Book added successfully:', response.data);
      
      // Show success modal and clear form
      setShowSuccess(true);
      setTitle('');
      setAuthor('');
      setGenre('');
      setPublicationYear('');
      setIsbn('');
      setDescription('');
      setImage(null);
      setPreview(null);
      setIsAvailable(true);
      setErrors({});

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className="add-book-page">
      <LeftSection />
      <div className="add-book">
        <h2>Add New Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label>Author</label>
            <input 
              type="text" 
              value={author} 
              onChange={(e) => setAuthor(e.target.value)} 
              required 
            />
            {errors.author && <span className="error">{errors.author}</span>}
          </div>
          <div className="form-group">
            <label>Genre</label>
            <input 
              type="text" 
              value={genre} 
              onChange={(e) => setGenre(e.target.value)} 
              required 
            />
            {errors.genre && <span className="error">{errors.genre}</span>}
          </div>
          <div className="form-group">
            <label>Publication Year</label>
            <input 
              type="number" 
              value={publicationYear} 
              onChange={(e) => setPublicationYear(e.target.value)} 
              required 
            />
            {errors.publicationYear && <span className="error">{errors.publicationYear}</span>}
          </div>
          <div className="form-group">
            <label>ISBN</label>
            <input 
              type="text" 
              value={isbn} 
              onChange={(e) => setIsbn(e.target.value)} 
              required 
            />
            {errors.isbn && <span className="error">{errors.isbn}</span>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>
          <div className="form-group">
            <label>Book Image</label>
            <input 
              type="file" 
              onChange={handleImageChange} 
              required 
            />
            {errors.image && <span className="error">{errors.image}</span>}
            {preview && <img src={preview} alt="Preview" className="image-preview" />}
          </div>
          <div className="form-group">
            <label>Available</label>
            <input 
              type="checkbox" 
              checked={isAvailable} 
              onChange={(e) => setIsAvailable(e.target.checked)} 
            />
          </div>
          <button type="submit">Add Book</button>
        </form>
        {showSuccess && (
          <div className="success-modal">
            <p>Book added successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBook;
