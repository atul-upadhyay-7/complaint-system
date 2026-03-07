const express = require('express');
const { body } = require('express-validator');
const {
    createComplaint,
    getComplaints,
    getComplaint,
    updateComplaint,
    deleteComplaint,
    getComplaintHistory,
    aiSuggest,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const createRules = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }).withMessage('Title too long'),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
    body('category').isIn(['Electricity', 'Water', 'Cleanliness', 'Maintenance', 'Internet', 'Security', 'Food', 'Other']).withMessage('Invalid category'),
    body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority'),
];

// All routes are protected
router.use(protect);

router.post('/ai-suggest', authorize('student'), aiSuggest);                     // AI live suggestions
router.post('/', authorize('student'), createRules, validate, createComplaint);
router.get('/', getComplaints);
router.get('/:id', getComplaint);
router.get('/:id/history', getComplaintHistory);
router.patch('/:id', authorize('admin', 'warden', 'technician'), updateComplaint);
router.delete('/:id', deleteComplaint);

module.exports = router;
