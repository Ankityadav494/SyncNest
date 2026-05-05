// ──────────────────────────────────────────────────────────────
// models/User.js – User Schema (created on first successful OTP verification)
// ──────────────────────────────────────────────────────────────
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Whether the user's email has been verified at least once
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Last login timestamp
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("OtpUser", userSchema);
