/*const express = require('express');
const router = express.Router();

// Import controller methods
const { register, login } = require('../controllers/authcontroller');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', login);

module.exports = router;
*/
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Existing routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// 🔥 New route to get profile info
router.get("/profile", authController.getProfile);

module.exports = router;
