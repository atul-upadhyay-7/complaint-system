const express = require('express');
const { body } = require('express-validator');
const {
    getAllComplaints,
    assignComplaint,
    updateStatus,
    getAnalytics,
    getAllUsers,
    getStaff,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All admin routes require authentication + admin/warden role
router.use(protect);
router.use(authorize('admin', 'warden'));

const assignRules = [
    body('assignedTo').notEmpty().withMessage('Assignee ID is required'),
    body('assignedToName').optional().isString(),
];

const statusRules = [
    body('status').isIn(['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected']).withMessage('Invalid status'),
    body('adminNotes').optional().isString().isLength({ max: 1000 }),
    body('rejectionReason').optional().isString(),
];

router.get('/complaints', getAllComplaints);
router.put('/assign/:id', assignRules, validate, assignComplaint);
router.put('/status/:id', statusRules, validate, updateStatus);
router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/staff', getStaff);

module.exports = router;
