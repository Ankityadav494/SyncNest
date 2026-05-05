// ──────────────────────────────────────────────────────────────
// routes/otpRoutes.js – API routes for OTP authentication
// ──────────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, getMe } = require("../controllers/otpController");
const otpRateLimiter = require("../middleware/rateLimiter");
const verifyToken = require("../middleware/auth");

// POST /api/auth/send-otp  — Rate-limited to 3 req/min per email
router.post("/send-otp", otpRateLimiter, sendOtp);

// POST /api/auth/verify-otp — Verifies OTP and returns JWT
router.post("/verify-otp", verifyOtp);

// GET /api/auth/me — Protected route (requires valid JWT)
router.get("/me", verifyToken, getMe);

module.exports = router;
