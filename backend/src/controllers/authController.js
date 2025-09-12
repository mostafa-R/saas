const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// ✅ توليد JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ✅ إرسال التوكن في الكوكيز + الـ response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // إعدادات الكوكيز
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS بس في البروडकشن
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 أيام
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
};

// Register Shipper / Carrier
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, phone, password, role } = req.body;

  if (!['shipper', 'carrier'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already in use' });

    user = await User.create({ name, email, phone, password, role });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
  const { name, email, phone, password, adminSecret } = req.body;

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Invalid admin secret' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already in use' });

    user = await User.create({ name, email, phone, password, role: 'admin' });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('❌ RegisterAdmin error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Logout (مسح الكوكيز)
exports.logout = (req, res) => {
  res.cookie('token', '', { maxAge: 1, httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
