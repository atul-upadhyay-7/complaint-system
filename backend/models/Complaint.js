const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 150,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: 2000,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Electricity', 'Water', 'Cleanliness', 'Maintenance', 'Internet', 'Security', 'Food', 'Other'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    assignedToName: { type: String, default: null },
    location: { type: String, trim: true },
    attachments: [{ type: String }],         // image URLs (Cloudinary/local)
    aiCategory: { type: String, default: null },  // AI auto-classification result
    aiPriority: { type: String, default: null },  // AI-predicted priority
    aiSentiment: { type: String, default: null },  // AI sentiment (Urgent/Frustrated/Neutral/Polite)
    aiEstimatedTime: { type: String, default: null },  // AI predicted resolution ETA
    resolvedAt: { type: Date, default: null },
    adminNotes: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    rejectionReason: { type: String, trim: true },
}, { timestamps: true });

// Index for fast queries
complaintSchema.index({ student: 1, status: 1 });
complaintSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
