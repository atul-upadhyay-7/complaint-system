const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// @route POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, role, rollNumber, hostel } = req.body;

    const user = await User.create({ name, email, password, role: role || 'student', rollNumber, hostel });
    const token = signToken(user._id);

    logger.info(`New user registered: ${email} (${user.role})`);
    res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, rollNumber: user.rollNumber, hostel: user.hostel } });
});

// @route POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user._id);
    logger.info(`User logged in: ${email}`);
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, rollNumber: user.rollNumber, hostel: user.hostel } });
});

// @route GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
    res.json({ success: true, user: req.user });
});

// @route POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'There is no user with that email address.' });

    const demoToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    logger.info(`Password reset token generated for ${user.email}`);

    // In a production app, we would send an HTML email here. 
    // For the hackathon demo, we simply return the reset token directly via JSON to jump right into the reset page.
    res.status(200).json({
        success: true,
        message: 'Password reset link sent! (Demo mode: Use token directly)',
        demoToken
    });
});

// @route POST /api/auth/reset-password/:token
exports.resetPassword = asyncHandler(async (req, res) => {
    const crypto = require('crypto');
    // Get hashed token from param
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = signToken(user._id);
    res.status(200).json({ success: true, message: 'Password reset completely successful!', token });
});
