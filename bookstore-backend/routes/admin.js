const express = require('express');
const jwt = require('jsonwebtoken');
const verifyAdminToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');

const adminCredentials = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD, // Make sure to hash and salt passwords from the env
};

// Admin login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
 
  if (username === adminCredentials.username && password === adminCredentials.password) {
    const token = jwt.sign({ username: adminCredentials.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    console.log(username,password)
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Add book
router.post('/add-books', verifyAdminToken, upload.single('image'), async (req, res) => {
  console.log("req.body: ", req.body);
  console.log("req.file.filename: ", req.file.filename);
  try {
    const { title, author, genre, publicationYear, isbn, description, isAvailable } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newBook = new Book({
      title,
      author,
      genre,
      publicationYear,
      isbn,
      description,
      image: imageUrl,
      isAvailable,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all books
router.get('/books', verifyAdminToken, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update book status
router.put('/books/:id/status', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;
  try {
    const book = await Book.findByIdAndUpdate(id, { isAvailable }, { new: true });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete book
router.delete('/books/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  try {
    await Book.findByIdAndDelete(id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update book details with new image if provided
router.put('/books/:id/details', verifyAdminToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, publicationYear, isbn, description, isAvailable } = req.body;
  console.log("req.params: ", id, " req.body: ", req.body);
  console.log("req.file: ", req.file);

  try {
    const updatedFields = {
      title,
      author,
      genre,
      publicationYear,
      isbn,
      description,
      isAvailable: isAvailable === 'on' ? true : false, // Convert 'on' to true, otherwise false
    };

    if (req.file) {
      updatedFields.image = `/uploads/${req.file.filename}`;
      console.log("updatedFields.image: ", updatedFields.image);
    }

    console.log("updatedFields: ", updatedFields);

    const book = await Book.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!book) {
      console.log("Book not found with id: ", id);
      return res.status(404).json({ message: 'Book not found' });
    }

    console.log("updated book: ", book);
    res.json(book);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: 'Server error', error });
  }
});









// Fetch all users
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Block/unblock user
router.put('/users/:id/block', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    console.log("block requested for: ", user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    console.log("changed block status: ",user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});









module.exports = router;
