const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RentedBookSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  rentedAt: {
    type: Date,
    default: Date.now
  },
  returnedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('RentedBook', RentedBookSchema);
