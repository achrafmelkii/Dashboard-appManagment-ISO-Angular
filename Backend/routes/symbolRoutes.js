// imageRoutes.js
const express = require('express');
const symbolController = require('../controllers/symbolController');

const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for getting all symbols
router.get('/', symbolController.getAllSymboles);

// Route for creating a new symbol
router.post('/', upload.single('image'), symbolController.createSymbole);

// Route for updating a symbol
router.put('/:id', upload.single('image'), symbolController.editSymbole);

// Route for deleting a symbol
router.delete('/:id', symbolController.deleteSymbole);

module.exports = router;
