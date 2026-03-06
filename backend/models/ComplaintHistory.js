const mongoose = require('mongoose');

const complaintHistorySchema = new mongoose.Schema({
    complaint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true,
        index: true,
    },
    action: {
        type: String,
        required: true,
        enum: [
            'created',
            'status_changed',
            'assigned',
            'unassigned',
            'priority_changed',
            'notes_updated',
            'rejected',
            'resolved',
        ],
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    oldValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
    note: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('ComplaintHistory', complaintHistorySchema);
