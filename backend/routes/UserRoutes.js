// backend/routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  verifyEmail,
  deleteUserProfile
} = require('../controllers/userController');
const { googleCallback, githubCallback } = require('../controllers/socialAuthController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// Log all requests to user routes
router.use((req, res, next) => {
  console.log(`User route accessed: ${req.method} ${req.path}`);
  next();
});

// Public routes
router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/verify/:token', verifyEmail);

// Social auth routes
router.post('/auth/google', googleCallback);
router.post('/auth/github', githubCallback);

// Protected routes (require authentication)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);

// 404 handler for user routes
router.use((req, res) => {
  console.log(`User route not found: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'User route not found' });
});

// Export the router
module.exports = router;