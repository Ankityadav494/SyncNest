// ──────────────────────────────────────────────────────────────
// controllers/otpController.js – Business logic for OTP auth
// ──────────────────────────────────────────────────────────────
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const Otp = require("../models/Otp");
const User = require("../models/User");
const sendOtpEmail = require("../utils/sendEmail");

// ─── POST /api/auth/send-otp ─────────────────────────────────
// Generates a 6-digit OTP, hashes it, stores it, and emails it.
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validate email presence
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // 2. Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 3. Prevent duplicate OTP spam — check if an OTP was sent recently
    //    (within the last 60 seconds) for this email
    const recentOtp = await Otp.findOne({
      email: normalizedEmail,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
    });

    if (recentOtp) {
      return res.status(429).json({
        success: false,
        message: "OTP already sent. Please wait before requesting a new one.",
      });
    }

    // 4. Delete any previous OTPs for this email (cleanup)
    await Otp.deleteMany({ email: normalizedEmail });

    // 5. Generate a cryptographically secure 6-digit OTP
    const otpPlain = crypto.randomInt(100000, 999999).toString();

    // 6. Hash the OTP with bcrypt before storing
    const salt = await bcrypt.genSalt(10);
    const otpHashed = await bcrypt.hash(otpPlain, salt);

    // 7. Save hashed OTP to database (TTL index auto-expires it in 5 min)
    await Otp.create({
      email: normalizedEmail,
      otp: otpHashed,
    });

    // 8. Send the plain OTP via email
    await sendOtpEmail(normalizedEmail, otpPlain);

    console.log(`📧 OTP sent to ${normalizedEmail}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Check your email.",
    });
  } catch (error) {
    console.error("❌ sendOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

// ─── POST /api/auth/verify-otp ───────────────────────────────
// Verifies the OTP and issues a JWT token on success.
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Validate inputs
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find the most recent OTP record for this email
    const otpRecord = await Otp.findOne({ email: normalizedEmail }).sort({
      createdAt: -1,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired or was never sent. Please request a new one.",
      });
    }

    // 3. Compare the submitted OTP with the hashed one
    const isMatch = await bcrypt.compare(otp.toString(), otpRecord.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check and try again.",
      });
    }

    // 4. OTP is valid — delete it so it can't be reused
    await Otp.deleteMany({ email: normalizedEmail });

    // 5. Find or create the user
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        email: normalizedEmail,
        isVerified: true,
        lastLogin: new Date(),
      });
    } else {
      user.isVerified = true;
      user.lastLogin = new Date();
      await user.save();
    }

    // 6. Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    console.log(`✅ User ${normalizedEmail} authenticated successfully`);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      token,
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("❌ verifyOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed. Please try again later.",
    });
  }
};

// ─── GET /api/auth/me ────────────────────────────────────────
// Protected route — returns the authenticated user's profile.
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("❌ getMe error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
