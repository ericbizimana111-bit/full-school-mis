const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateDetails, updatePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');


const router = express.Router();
router.post('/register', authLimiter, [
    body('email').isEmail().withMessage('Please provide a valid email'), body('password').isLength({
        min: 6
    }).withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('role').isIn(['admin', 'teacher', 'student', 'parent']).withMessage('Invalid role')], validate, register);
router.post('/login', authLimiter, [body('email').isEmail().withMessage('Please provide a valid email'),
body('password').notEmpty().withMessage('Password is required')], validate, login);
router.get(' / me', protect, getMe);
router.put(' / updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);



module.exports = router;

