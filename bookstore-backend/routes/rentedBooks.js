const express = require('express');
const router = express.Router();
const RentedBook = require('../models/RentedBook');



// Get rented book by book ID
router.get('/:id', async (req, res) => {
   
  try {
    const rentedBook = await RentedBook.findOne({ book: req.params.id });
    
    if (rentedBook) {
        console.log("found rented book: ",rentedBook);
      res.json(rentedBook);
    } else {
        
      res.status(404).json({ message: 'Rented book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




module.exports = router;
