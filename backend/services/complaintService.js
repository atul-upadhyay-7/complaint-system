const Complaint = require('../models/Complaint');
const ComplaintHistory = require('../models/ComplaintHistory');
const notificationService = require('./notificationService');
const logger = require('../utils/logger');
const { autoCategorizeComplaint } = require('./aiService'); // Import autoCategorizeComplaint
const sendEmail = require('../utils/sendEmail');

// ─── Create a new complaint + fire creation event ──────────────────────────
const createComplaint = async (data, student) => {
    // Await AI categorization
    const predictedCategory = await autoCategorizeComplaint(
        data.title,
        data.description
    );

    const complaint = await Complaint.create({
        ...data,
        student: student._id,
        aiCategory: predictedCategory, // Add aiCategory to the complaint data
    });
    await complaint.populate('student', 'name email rollNumber hostel');

    // Audit entry
    await ComplaintHistory.create({
        complaint: complaint._id,
        action: 'created',
        performedBy: student._id,
        newValue: { title: complaint.title, category: complaint.category, priority: complaint.priority },
    });

    notificationService.notifyComplaintCreated(complaint, student.name);
    logger.info(`Complaint created: "${complaint.title}" by ${student.email}`);

    // Send Welcome / Pending Email Notification
    const pendingEmailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #3b82f6;">Complaint Received 📝</h2>
            <p>Hi <strong>${student.name}</strong>,</p>
            <p>We successfully received your campus complaint: <em>"${complaint.title}"</em>.</p>
            <div style="font-size: 16px; margin: 20px 0; background-color: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6;">
                Status: <span style="font-weight: bold; color: #3b82f6;">Pending</span>
            </div>
            <p>Our administrative team will review it shortly. You will receive an email as soon as a technician is assigned!</p>
            <br/>
            <p>Check the live progress from your UniIssueHub dashboard.</p>
            <p style="color: #64748b; font-size: 12px;">This is an automated notification from UniIssueHub.</p>
        </div>
    `;

    try {
        await sendEmail({
            email: student.email,
            subject: `Complaint Received: ${complaint.title}`,
            html: pendingEmailHtml
        });
    } catch (error) {
        logger.error(`Failed to send creation email to ${student.email}: ${error.message}`);
    }

    return complaint;
};

// ─── Update a complaint (status / assignment / notes) ─────────────────────
const updateComplaint = async (complaintId, updates, performedBy) => {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        const err = new Error('Complaint not found');
        err.statusCode = 404;
        throw err;
    }

    const oldStatus = complaint.status;
    const oldAssignedTo = complaint.assignedTo;

    // Apply updates
    const allowedFields = ['status', 'assignedTo', 'assignedToName', 'adminNotes', 'priority', 'rejectionReason'];
    allowedFields.forEach((field) => {
        if (updates[field] !== undefined) complaint[field] = updates[field];
    });

    if (updates.status === 'Resolved' && !complaint.resolvedAt) {
        complaint.resolvedAt = new Date();
    }

    await complaint.save();
    await complaint.populate('student', 'name email rollNumber hostel');
    await complaint.populate('assignedTo', 'name email department');

    // History entries
    if (updates.status && updates.status !== oldStatus) {
        await ComplaintHistory.create({
            complaint: complaint._id,
            action: updates.status === 'Resolved' ? 'resolved' : updates.status === 'Rejected' ? 'rejected' : 'status_changed',
            performedBy: performedBy._id,
            oldValue: oldStatus,
            newValue: updates.status,
        });
        notificationService.notifyStatusChanged(complaint, oldStatus);

        // Send Email Notification for Status Change
        const statusColors = { 'In Progress': '#f59e0b', Resolved: '#10b981', Rejected: '#ef4444', Assigned: '#3b82f6' };
        const color = statusColors[updates.status] || '#3b82f6';
        const notesHtml = updates.adminNotes ? `<p style="background-color: #f8fafc; padding: 15px; border-left: 4px solid ${color};"><strong>Notes:</strong> ${updates.adminNotes}</p>` : '';
        const rejectionHtml = updates.rejectionReason ? `<p style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #ef4444; color: #b91c1c;"><strong>Reason:</strong> ${updates.rejectionReason}</p>` : '';

        const statusEmailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: ${color};">Status Update: ${updates.status}</h2>
                <p>Hi <strong>${complaint.student.name}</strong>,</p>
                <p>Your campus complaint <em>"${complaint.title}"</em> has been updated!</p>
                <div style="font-size: 18px; margin: 20px 0;">New Status: <span style="font-weight: bold; color: ${color};">${updates.status}</span></div>
                ${notesHtml}
                ${rejectionHtml}
                <br/>
                <p>Check the live progress from your UniIssueHub dashboard.</p>
                <p style="color: #64748b; font-size: 12px;">This is an automated notification from UniIssueHub.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: complaint.student.email,
                subject: `Complaint Update: ${updates.status} - ${complaint.title}`,
                html: statusEmailHtml
            });
        } catch (error) {
            logger.error(`Failed to send status email to ${complaint.student.email}: ${error.message}`);
        }
    }

    if (updates.assignedTo && updates.assignedTo !== String(oldAssignedTo)) {
        await ComplaintHistory.create({
            complaint: complaint._id,
            action: 'assigned',
            performedBy: performedBy._id,
            oldValue: oldAssignedTo,
            newValue: updates.assignedTo,
            note: `Assigned to ${updates.assignedToName || updates.assignedTo}`,
        });
        notificationService.notifyComplaintAssigned(complaint, updates.assignedToName);

        // Send Email Notification
        const etaMap = { High: '2 hours', Medium: '24 hours', Low: '48 hours' };
        const eta = etaMap[complaint.priority] || '24 hours';
        const technicianName = updates.assignedToName || 'A technician';

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">Technician Assigned! 🛠️</h2>
                <p>Hi <strong>${complaint.student.name}</strong>,</p>
                <p>Good news! <strong>${technicianName}</strong> has been officially assigned to your campus complaint: <em>"${complaint.title}"</em>.</p>
                <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Estimated Arrival / Resolution Time:</strong> Within ${eta}</p>
                </div>
                <p>You can check the live progress from your UniIssueHub dashboard.</p>
                <br/>
                <p style="color: #64748b; font-size: 12px;">This is an automated notification from UniIssueHub.<br/>Happy hacking!</p>
            </div>
        `;

        try {
            await sendEmail({
                email: complaint.student.email,
                subject: `Technician Assigned: ${complaint.title}`,
                html: emailHtml
            });
        } catch (error) {
            logger.error(`Failed to send email to ${complaint.student.email}: ${error.message}`);
        }
    }

    logger.info(`Complaint ${complaintId} updated by ${performedBy.email}: ${JSON.stringify(updates)}`);
    return complaint;
};

// ─── Analytics aggregation ────────────────────────────────────────────────
const getAnalytics = async () => {
    const [statusCounts, categoryCounts, priorityCounts, recentComplaints, resolvedComplaints] = await Promise.all([
        Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]),
        Complaint.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
        Complaint.find().sort({ createdAt: -1 }).limit(10).populate('student', 'name rollNumber hostel'),
        Complaint.find({ status: 'Resolved', resolvedAt: { $ne: null } }).select('createdAt resolvedAt'),
    ]);

    const total = await Complaint.countDocuments();

    let avgResolutionTimeHours = 0;
    if (resolvedComplaints.length > 0) {
        const totalMs = resolvedComplaints.reduce((sum, c) => sum + (new Date(c.resolvedAt) - new Date(c.createdAt)), 0);
        avgResolutionTimeHours = Math.round(totalMs / resolvedComplaints.length / (1000 * 60 * 60));
    }

    const statusMap = {};
    statusCounts.forEach((s) => { statusMap[s._id] = s.count; });

    return {
        total,
        pending: statusMap['Pending'] || 0,
        assigned: statusMap['Assigned'] || 0,
        inProgress: statusMap['In Progress'] || 0,
        resolved: statusMap['Resolved'] || 0,
        rejected: statusMap['Rejected'] || 0,
        avgResolutionTimeHours,
        topCategories: categoryCounts,
        priorityBreakdown: priorityCounts,
        recentComplaints,
    };
};

module.exports = { createComplaint, updateComplaint, getAnalytics };
