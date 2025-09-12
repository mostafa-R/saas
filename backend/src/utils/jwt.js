const jwt = require('jsonwebtoken');

// إنشاء JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// التحقق من JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('التوكن غير صالح');
  }
};

// استخراج التوكن من الهيدر
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

// إنشاء استجابة مع التوكن
const sendTokenResponse = (user, statusCode, res, message = 'تم بنجاح') => {
  const token = generateToken({ 
    userId: user._id, 
    role: user.role 
  });

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isActive: user.isActive,
        avatar: user.avatar
      }
    });
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  sendTokenResponse
};