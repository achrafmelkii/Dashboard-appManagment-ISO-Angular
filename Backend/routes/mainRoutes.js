const express = require("express");
const uploadRoutes = require("./uploadRoutes");
const imageRoutes = require("./imageRoutes");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const symbolRoutes = require("./symbolRoutes");
const urlRoutes = require("./urlRoutes");
const challengeRoutes = require("./challengeRoutes");
const quizRoutes = require("./quizRoutes");
const analRoutes = require("./analyticsRoutes");
// const authMiddleware = require('../middleware/authMiddleware');
const authController = require("../controllers/authController");
const router = express.Router();

// router.use('/images',authMiddleware.verifyToken, uploadRoutes);
// router.use('/images', authMiddleware.verifyToken, imageRoutes);
// router.use('/users',authMiddleware.verifyToken, userRoutes);
// router.use('/admins', authMiddleware.verifyToken, adminRoutes);
// router.use('/symbols', authMiddleware.verifyToken, symbolRoutes);
// router.use('/urls', authMiddleware.verifyToken, urlRoutes);
// router.use('/quizs', authMiddleware.verifyToken, quizRoutes);
// router.use('/challenge', authMiddleware.verifyToken, challengeRoutes);
// router.post('/checkAdmin', authController.checkSuperAdmin);
// router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.post('/logout', authController.logout);
// router.post('/check-auth',authController.checkAuth)
// router.use('/getanalytics',authMiddleware.verifyToken, analRoutes);

// module.exports = router;
router.use("/images", uploadRoutes);
router.use("/images", imageRoutes);
router.use("/users", userRoutes);
router.use("/admins", adminRoutes);
router.use("/symbols", symbolRoutes);
router.use("/urls", urlRoutes);
router.use("/quizs", quizRoutes);
router.use("/challenge", challengeRoutes);
router.post("/checkAdmin", authController.checkSuperAdmin);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/check-auth", authController.checkAuth);
router.use("/getanalytics", analRoutes);

module.exports = router;
