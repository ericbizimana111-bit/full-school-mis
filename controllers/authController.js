
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const logger = require('../utils/logger');
const emailService = require('../utils/emailService'); // @desc Register user // @route POST /api/auth/register // @access Public

exports.register = async (req, res, next) => {
    try {
        const { email, password, role, firstName, lastName, phone } = req.body; // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        } // Create user

        const user = await User.create({ email, password, role, firstName, lastName, phone }); // Send welcome email 
        await emailService.sendWelcomeEmail(user); // Create token
        const token = user.getSignedJwtToken(); res.status(201).json({
            success: true, token, user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        logger.error(`Register Error: ${error.message} `);
        next(error);
    }
}; // @desc Login user // @route POST /api/auth/login // @access Public 
exports.login = async (req, res, next) => {

    try {
        const { email, password } = req.body; // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false, message: 'Please provide email and password'
            });
        } // Check for user 
        const user = await User.findOne({ email }).select('+password'); if (!user) {
            return res.status(401).json({
                success: false, message: 'Invalid credentials'
            });
        } // Check if password matches

        const isMatch = await user.matchPassword(password);
        if (!isMatch) { return res.status(401).json({ success: false, message: 'Invalid credentials' }); } // Check if user is active
        if (!user.isActive) { return res.status(401).json({ success: false, message: 'Account is inactive' }); } // Update last login 
        user.lastLogin = Date.now();
        await user.save(); // Create token 
        const token = user.getSignedJwtToken();
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                photo: user.photo
            }
        });
    } catch (error) {
        logger.error(`Login Error: ${error.message} `);
        next(error);
    }
}; // @desc Get current logged in user // @route GET /api/auth/me //  @access Private

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id); res.status(200).json({
            success: true, data: user
        });
    } catch (error) { next(error); }
}; // @desc Update user details // @route PUT /api/auth / updatedetails // @access Private 
exports.updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        }; const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: user });
    } catch (error) { next(error); }
}; // @desc Update password // @route PUT /api/auth/updatepassword // @access Private 
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password'); // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            });
        } user.password = req.body.newPassword;
        await user.save();
        const token = user.getSignedJwtToken();
        res.status(200).json({ success: true, token });
    } catch (error) {
        next(error);
    }
}; 
