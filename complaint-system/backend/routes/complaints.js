const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaint,
    updateComplaint,
    deleteComplaint,
    getAnalytics,
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect); // All complaint routes require login

router.get('/analytics', adminOnly, getAnalytics);
router.route('/').get(getComplaints).post(createComplaint);
router.route('/:id').get(getComplaint).patch(adminOnly, updateComplaint).delete(deleteComplaint);

module.exports = router;
