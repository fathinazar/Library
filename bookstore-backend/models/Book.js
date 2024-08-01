
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publicationYear: { type: Number, required: true },
  isbn: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  isAvailable: { type: Boolean, default: true },
  likes: { type: Number, default: 0 }, // Add likes field
  likedBy: [String], // Array of user emails who liked the book
  comments: [{ // Add comments field
    id: Number,
    email: String,
    text: String
  }]
});

module.exports = mongoose.model('Book', BookSchema);
