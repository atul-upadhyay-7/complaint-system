const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT and attach user to req
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user || !req.user.isActive) {
            return res.status(401).json({ success: false, message: 'User not found or deactivated' });
        }
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
};

// Role-based access control factory
// Usage: authorize('admin', 'warden')
const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: `Access denied. Required role(s): ${roles.join(', ')}`,
        });
    }
    next();
};

// Shorthand
const adminOnly = authorize('admin');
const adminOrWarden = authorize('admin', 'warden');
const techOrAdmin = authorize('admin', 'technician');

module.exports = { protect, authorize, adminOnly, adminOrWarden, techOrAdmin };
