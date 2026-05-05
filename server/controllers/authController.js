const crypto = require('crypto');
const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const sendOtpEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, college, bio, skills, github, linkedin, password } = req.body;

    user.name = name !== undefined ? name : user.name;
    user.email = email !== undefined ? email : user.email;
    user.college = college !== undefined ? college : user.college;
    user.bio = bio !== undefined ? bio : user.bio;
    user.skills = skills !== undefined ? skills : user.skills;
    user.github = github !== undefined ? github : user.github;
    user.linkedin = linkedin !== undefined ? linkedin : user.linkedin;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/auth/send-otp ────────────────────────────────
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required.' });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);
    await Otp.deleteMany({ email: email.toLowerCase() });
    await Otp.create({ email: email.toLowerCase(), otpHash });
    await sendOtpEmail(email, otp);
    res.json({ success: true, message: 'OTP sent to ' + email });
  } catch (error) {
    console.error('sendOtp error:', error.message);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// ─── POST /api/auth/verify-otp ─────────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }
    const record = await Otp.findOne({ email: email.toLowerCase() });
    if (!record) {
      return res.status(400).json({ message: 'OTP expired or not found. Request a new one.' });
    }
    const isMatch = await bcrypt.compare(otp, record.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }
    await Otp.deleteOne({ _id: record._id });
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const randomPass = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
      const namePart = email.split('@')[0];
      user = await User.create({
        name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        email: email.toLowerCase(),
        password: randomPass,
      });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('verifyOtp error:', error.message);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
};

// ─── POST /api/auth/register-with-otp ──────────────────────
// Verify OTP first, then create the account.
exports.registerWithOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // 1. Check OTP
    const record = await Otp.findOne({ email: email.toLowerCase() });
    if (!record) {
      return res.status(400).json({ message: 'OTP expired or not found. Request a new one.' });
    }
    const isMatch = await bcrypt.compare(otp, record.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // 2. Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
    }

    // 3. Delete used OTP
    await Otp.deleteOne({ _id: record._id });

    // 4. Create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('🔥 FULL ERROR:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};
