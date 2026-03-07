const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');
const sendEmail = require('../utils/sendEmail');

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

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host').replace(':5000', ':5173')}/reset-password/${demoToken}`;

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Password Reset Request</h2>
            <p>Hi there,</p>
            <p>You are receiving this email because you (or someone else) have requested the reset of a password for your UniIssueHub account.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #3b82f6; word-wrap: break-word;">${resetUrl}</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
        </div>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            html: emailHtml
        });

        res.status(200).json({
            success: true,
            message: 'Email sent securely to your inbox',
            demoToken: process.env.SMTP_EMAIL ? undefined : demoToken // Only pass back the demo token if we are not using a real SMTP account
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        logger.error(`Error sending email: ${err}`);
        return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
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
