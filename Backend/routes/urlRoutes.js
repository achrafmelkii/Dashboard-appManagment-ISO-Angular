// urlRoutes.js
const express = require('express');
const urlController = require('../controllers/urlController');

const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for getting all symbols
router.get('/video', urlController.getVideoUrl);

// Route for creating a new symbol
router.put('/video', upload.single('video'), urlController.updateVideoUrl);


router.get('/rss', urlController.getFeedUrl);

router.put('/rss' , urlController.updateFeedUrl)



router.get('/pdf', urlController.getPolitiqueUrl);

router.put('/pdf' , urlController.updatePolitiqueUrl)



module.exports = router;
