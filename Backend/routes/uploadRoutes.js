// uploadRoutes.js
const express = require('express');
const uploadController = require('../controllers/uploadController');

const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/upload',upload.single('image'), uploadController.uploadImage);

module.exports = router;
