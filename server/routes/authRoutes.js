const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, getProfile, updateProfile, sendOtp, verifyOtp, registerWithOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { message: 'Too many OTP requests. Please wait a minute.' },
});

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register-with-otp', registerWithOtp);

module.exports = router;
