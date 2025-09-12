const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware لحماية المسارات
exports.protect = async (req, res, next) => {
  let token;

  // التوكن من الكوكيز
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'غير مصرح، برجاء تسجيل الدخول' });
  }

  try {
    // تحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // اجلب بيانات المستخدم
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    next();
  } catch (err) {
    console.error('❌ Auth error:', err);
    return res.status(401).json({ message: 'التوكن غير صالح أو منتهي' });
  }
};

// Middleware للتحقق من الدور
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'غير مصرح لك بهذا الإجراء' });
    }
    next();
  };
};
