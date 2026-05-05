// ──────────────────────────────────────────────────────────────
// models/Otp.js – OTP Schema with TTL auto-expiry
// ──────────────────────────────────────────────────────────────
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  // The email the OTP was sent to
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  // Bcrypt-hashed OTP (never stored in plain text)
  otp: {
    type: String,
    required: true,
  },

  // Timestamp used by MongoDB TTL index to auto-delete expired docs
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 300 seconds = 5 minutes — MongoDB auto-deletes after this
  },
});

// Compound index for fast lookups by email
otpSchema.index({ email: 1 });

module.exports = mongoose.model("Otp", otpSchema);
