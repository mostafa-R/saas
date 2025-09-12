const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');


router.post('/register', [
body('name').notEmpty(),
body('email').isEmail(),
body('password').isLength({ min: 6 }),
body('role').notEmpty()
], authController.register);


router.post('/register-admin', [
body('name').notEmpty(),
body('email').isEmail(),
body('password').isLength({ min: 6 }),
body('adminSecret').notEmpty()
], authController.registerAdmin);


router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;