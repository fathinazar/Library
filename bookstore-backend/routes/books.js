const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const RentedBook = require('../models/RentedBook');
const authMiddleware = require('../middleware/authMiddleware');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like a book
router.post('/:id/like',  async (req, res) => {
  const userEmail = req.body.email;
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      if (!book.likedBy.includes(userEmail)) {
        book.likes += 1;
        book.likedBy.push(userEmail);
        await book.save();
      }
      res.json({ likes: book.likes, likedBy: book.likedBy });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unlike a book
router.post('/:id/unlike',  async (req, res) => {
  const userEmail = req.body.email;
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      if (book.likedBy.includes(userEmail)) {
        book.likes -= 1;
        book.likedBy = book.likedBy.filter(email => email !== userEmail);
        await book.save();
      }
      res.json({ likes: book.likes, likedBy: book.likedBy });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a comment on a book
router.post('/:id/comments',  async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      const { email, text } = req.body;
      const newComment = { id: Date.now(), email, text };
      book.comments.push(newComment);
      await book.save();
      res.status(201).json(newComment);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});






// Rent a book
router.post('/:id/rent', authMiddleware, async (req, res) => {
  console.log("req.params.id: ", req.params.id, " req.user.id: ", req.user.id);
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    let rentedBook = await RentedBook.findOne({ book: req.params.id, user: req.user.id });

    if (rentedBook) {
      // Book already rented by this user
      if (rentedBook.returnedAt) {
        // If the book has been returned, update rental dates
        rentedBook.rentedAt = new Date();
        rentedBook.returnedAt = null; // Ensure returnedAt is null for active rental
        rentedBook.isActive = true; // Set as active rental
      } else {
        // If the book is currently rented, just update the rentedAt date
        rentedBook.rentedAt = new Date();
      }
      await rentedBook.save();
    } else {
      // New rental record
      rentedBook = new RentedBook({
        book: req.params.id,
        user: req.user.id,
        rentedAt: new Date(),
        isActive: true
      });
      await rentedBook.save();
    }

    book.isAvailable = false;
    await book.save();
    res.status(201).json(rentedBook);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: error.message });
  }
});








// Return a book
router.post('/:id/return', authMiddleware, async (req, res) => {
  try {
    const rentedBook = await RentedBook.findOne({ book: req.params.id, user: req.user.id, isActive: true });

    if (rentedBook) {
      rentedBook.returnedAt = new Date();
      rentedBook.isActive = false; // Mark rental as inactive
      await rentedBook.save();

      const book = await Book.findById(req.params.id);
      book.isAvailable = true;
      await book.save();

      res.status(200).json(rentedBook);
    } else {
      res.status(400).json({ message: 'Book is not rented by this user or already returned' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





module.exports = router;
