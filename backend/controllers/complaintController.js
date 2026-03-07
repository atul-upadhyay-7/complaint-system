const Complaint = require('../models/Complaint');
const ComplaintHistory = require('../models/ComplaintHistory');
const complaintService = require('../services/complaintService');
const asyncHandler = require('../utils/asyncHandler');

// @route POST /api/complaints
exports.createComplaint = asyncHandler(async (req, res) => {
    const { title, description, category, priority, location, attachments } = req.body;
    const complaint = await complaintService.createComplaint(
        { title, description, category, priority, location, attachments: attachments || [] },
        req.user
    );
    res.status(201).json({ success: true, complaint });
});

// @route GET /api/complaints
exports.getComplaints = asyncHandler(async (req, res) => {
    const { status, category, priority, page = 1, limit = 10, search } = req.query;
    const filter = {};

    if (req.user.role === 'student') filter.student = req.user._id;
    if (req.user.role === 'technician') filter.assignedTo = req.user._id;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
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

// @route GET /api/complaints/:id
exports.getComplaint = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id)
        .populate('student', 'name email rollNumber hostel')
        .populate('assignedTo', 'name email department');
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    if (req.user.role === 'student' && complaint.student._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, complaint });
});

// @route PATCH /api/complaints/:id
exports.updateComplaint = asyncHandler(async (req, res) => {
    // If technician, ensure they are assigned to this complaint
    if (req.user.role === 'technician') {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        // Use String comparison to reliably compare ObjectIds
        const assignedToId = complaint.assignedTo ? complaint.assignedTo.toString() : null;
        const currentUserId = req.user._id.toString();

        if (assignedToId !== currentUserId) {
            console.warn(`[TECH AUTH] Denied: complaint.assignedTo=${assignedToId} vs user=${currentUserId}`);
            return res.status(403).json({ success: false, message: 'Not authorized to update this specific complaint' });
        }

        // Technicians can only update the status and notes
        const allowedTechFields = ['status', 'adminNotes'];
        Object.keys(req.body).forEach(key => {
            if (!allowedTechFields.includes(key)) delete req.body[key];
        });
    }

    try {
        const complaint = await complaintService.updateComplaint(req.params.id, req.body, req.user);
        res.json({ success: true, complaint });
    } catch (err) {
        console.error('[UPDATE COMPLAINT ERROR]', err.message, err.stack);
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server error' });
    }
});

// @route DELETE /api/complaints/:id
exports.deleteComplaint = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    if (req.user.role !== 'admin' && complaint.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await complaint.deleteOne();
    res.json({ success: true, message: 'Complaint deleted' });
});

// @route GET /api/complaints/:id/history
exports.getComplaintHistory = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    if (req.user.role === 'student' && complaint.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const history = await ComplaintHistory.find({ complaint: req.params.id })
        .populate('performedBy', 'name email role')
        .sort({ createdAt: 1 });

    res.json({ success: true, count: history.length, history });
});
