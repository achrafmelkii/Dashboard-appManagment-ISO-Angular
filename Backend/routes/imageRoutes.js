// imageRoutes.js
const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.get('/getAllImages', imageController.getAllImages);
router.put('/editImage/:imageName',upload.single('newImage'), imageController.editImage);

module.exports = router;
