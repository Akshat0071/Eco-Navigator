const express = require('express');
const router = express.Router();
const { googleCallback, githubCallback } = require('../controllers/socialAuthController');
const { registerUser, loginUser, verifyEmail } = require('../controllers/userController');

// Social Auth Routes
router.post('/auth/google/callback', googleCallback);
router.post('/auth/github/callback', githubCallback);

// Traditional Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);

module.exports = router; 