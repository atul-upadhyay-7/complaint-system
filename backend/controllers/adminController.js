const User = require('../models/User');
const Complaint = require('../models/Complaint');
const complaintService = require('../services/complaintService');
const asyncHandler = require('../utils/asyncHandler');

// @route GET /api/admin/complaints — all complaints with rich filters
exports.getAllComplaints = asyncHandler(async (req, res) => {
    const { status, category, priority, assignedTo, page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
    ];

    const skip = (page - 1) * limit;
    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
        .populate('student', 'name email rollNumber hostel')
        .populate('assignedTo', 'name email department')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    res.json({ success: true, count: complaints.length, total, totalPages: Math.ceil(total / limit), currentPage: Number(page), complaints });
});

// @route PUT /api/admin/assign/:id — assign complaint to technician/warden
exports.assignComplaint = asyncHandler(async (req, res) => {
    const { assignedTo, assignedToName } = req.body;

    const complaint = await complaintService.updateComplaint(
        req.params.id,
        { assignedTo, assignedToName, status: 'Assigned' },
        req.user
    );
    res.json({ success: true, message: 'Complaint assigned', complaint });
});

// @route PUT /api/admin/status/:id — update complaint status
exports.updateStatus = asyncHandler(async (req, res) => {
    const { status, adminNotes, rejectionReason } = req.body;
    const complaint = await complaintService.updateComplaint(
        req.params.id,
        { status, adminNotes, rejectionReason },
        req.user
    );
    res.json({ success: true, message: 'Status updated', complaint });
});

// @route GET /api/admin/analytics — dashboard stats
exports.getAnalytics = asyncHandler(async (req, res) => {
    const analytics = await complaintService.getAnalytics();
    res.json({ success: true, analytics });
});

// @route GET /api/admin/users — list all users
exports.getAllUsers = asyncHandler(async (req, res) => {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    const skip = (page - 1) * limit;
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json({ success: true, count: users.length, total, users });
});

// @route GET /api/admin/technicians — list technicians and wardens for assignment dropdown
exports.getStaff = asyncHandler(async (req, res) => {
    const staff = await User.find({ role: { $in: ['technician', 'warden'] } }).select('name email role department');
    res.json({ success: true, staff });
});
