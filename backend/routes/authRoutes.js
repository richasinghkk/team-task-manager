const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  getUserByEmail
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.get('/user-by-email', protect, getUserByEmail);

module.exports = router;