// ──────────────────────────────────────────────────────────────
// middleware/rateLimiter.js – Rate-limit OTP requests per email
// ──────────────────────────────────────────────────────────────
const rateLimit = require("express-rate-limit");

/**
 * Limits each IP to 3 OTP send requests per 1-minute window.
 * Prevents abuse and email bombing.
 */
const otpRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 3,              // max 3 requests per window per key
  standardHeaders: true,
  legacyHeaders: false,

  // Use the email from the request body as the rate-limit key
  // so the limit is per-email, not just per-IP
  keyGenerator: (req) => {
    return req.body.email || req.ip;
  },

  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many OTP requests. Please wait 1 minute before trying again.",
    });
  },
});

module.exports = otpRateLimiter;
