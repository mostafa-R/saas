const { body } = require('express-validator');

// تحقق من بيانات التسجيل
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('الاسم يجب أن يكون بين 2 و 50 حرف')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/)
    .withMessage('الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط'),
  
  body('email')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
  
  body('phone')
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('رقم الهاتف يجب أن يكون رقم مصري صحيح (يبدأ بـ 010, 011, 012, 015)'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون على الأقل 6 أحرف')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('كلمة المرور يجب أن تحتوي على حرف صغير وكبير ورقم على الأقل'),
  
  body('role')
    .optional()
    .isIn(['shipper', 'carrier'])
    .withMessage('الدور يجب أن يكون shipper أو carrier'),
  
  body('address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('الشارع يجب أن يكون بين 5 و 200 حرف'),
  
  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('المدينة يجب أن تكون بين 2 و 50 حرف'),
  
  body('address.governorate')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('المحافظة يجب أن تكون بين 2 و 50 حرف'),
  
  body('address.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('الإحداثيات يجب أن تكون مصفوفة من رقمين'),
  
  body('address.coordinates.*')
    .optional()
    .isNumeric()
    .withMessage('الإحداثيات يجب أن تكون أرقام'),
  
  // للناقلين فقط
  body('carrierInfo.licenseNumber')
    .if(body('role').equals('carrier'))
    .notEmpty()
    .withMessage('رقم الرخصة مطلوب للناقلين')
    .isLength({ min: 5, max: 20 })
    .withMessage('رقم الرخصة يجب أن يكون بين 5 و 20 حرف'),
  
  body('carrierInfo.vehicleType')
    .if(body('role').equals('carrier'))
    .isIn(['truck', 'van', 'motorcycle', 'car'])
    .withMessage('نوع المركبة غير صحيح'),
  
  body('carrierInfo.vehicleCapacity')
    .if(body('role').equals('carrier'))
    .isNumeric({ min: 1 })
    .withMessage('سعة المركبة يجب أن تكون رقم أكبر من 1')
];

// تحقق من بيانات تسجيل الدخول
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
];

// تحقق من تحديث كلمة المرور
const validateUpdatePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('كلمة المرور الحالية مطلوبة'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('كلمة المرور الجديدة يجب أن تحتوي على حرف صغير وكبير ورقم على الأقل'),
  
  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('تأكيد كلمة المرور غير متطابق');
      }
      return true;
    })
];

// تحقق من بيانات تحديث الملف الشخصي
const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('الاسم يجب أن يكون بين 2 و 50 حرف')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/)
    .withMessage('الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط'),
  
  body('phone')
    .optional()
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('رقم الهاتف يجب أن يكون رقم مصري صحيح'),
  
  body('address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('الشارع يجب أن يكون بين 5 و 200 حرف'),
  
  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('المدينة يجب أن تكون بين 2 و 50 حرف'),
  
  body('address.governorate')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('المحافظة يجب أن تكون بين 2 و 50 حرف')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdatePassword,
  validateUpdateProfile
};