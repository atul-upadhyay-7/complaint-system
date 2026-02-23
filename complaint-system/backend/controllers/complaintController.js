const Complaint = require('../models/Complaint');

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
    try {
        const { title, description, category, priority, location } = req.body;

        const complaint = await Complaint.create({
            title,
            description,
            category,
            priority,
            location,
            student: req.user._id,
        });

        await complaint.populate('student', 'name email rollNumber hostel');
        res.status(201).json({ success: true, complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all complaints (admin) or own complaints (student)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    try {
        const { status, category, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (req.user.role === 'student') {
            filter.student = req.user._id;
        }
        if (status) filter.status = status;
        if (category) filter.category = category;

        const skip = (page - 1) * limit;
        const total = await Complaint.countDocuments(filter);
        const complaints = await Complaint.find(filter)
            .populate('student', 'name email rollNumber hostel')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({
            success: true,
            count: complaints.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            complaints,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('student', 'name email rollNumber hostel');
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        // Students can only see their own
        if (req.user.role === 'student' && complaint.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update complaint status / assign (admin only)
// @route   PATCH /api/complaints/:id
// @access  Private (Admin)
const updateComplaint = async (req, res) => {
    try {
        const { status, assignedTo, adminNotes, priority } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        if (status) complaint.status = status;
        if (assignedTo !== undefined) complaint.assignedTo = assignedTo;
        if (adminNotes !== undefined) complaint.adminNotes = adminNotes;
        if (priority) complaint.priority = priority;

        if (status === 'Resolved' && !complaint.resolvedAt) {
            complaint.resolvedAt = new Date();
        }

        await complaint.save();
        await complaint.populate('student', 'name email rollNumber hostel');

        res.json({ success: true, complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin or complaint owner)
const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        if (req.user.role !== 'admin' && complaint.student.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await complaint.deleteOne();
        res.json({ success: true, message: 'Complaint deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get dashboard analytics (admin)
// @route   GET /api/complaints/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
    try {
        const [statusCounts, categoryCounts, recentComplaints, resolvedComplaints] = await Promise.all([
            Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
            Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]),
            Complaint.find().sort({ createdAt: -1 }).limit(5).populate('student', 'name rollNumber'),
            Complaint.find({ status: 'Resolved', resolvedAt: { $ne: null } }).select('createdAt resolvedAt'),
        ]);

        const total = await Complaint.countDocuments();

        // Average resolution time in hours
        let avgResolutionTime = 0;
        if (resolvedComplaints.length > 0) {
            const totalMs = resolvedComplaints.reduce((sum, c) => {
                return sum + (new Date(c.resolvedAt) - new Date(c.createdAt));
            }, 0);
            avgResolutionTime = Math.round(totalMs / resolvedComplaints.length / (1000 * 60 * 60));
        }

        const statusMap = {};
        statusCounts.forEach((s) => { statusMap[s._id] = s.count; });

        res.json({
            success: true,
            analytics: {
                total,
                pending: statusMap['Pending'] || 0,
                inProgress: statusMap['In Progress'] || 0,
                resolved: statusMap['Resolved'] || 0,
                avgResolutionTimeHours: avgResolutionTime,
                topCategories: categoryCounts,
                recentComplaints,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createComplaint, getComplaints, getComplaint, updateComplaint, deleteComplaint, getAnalytics };
