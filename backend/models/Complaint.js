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
    aiConfidence: {                                   // 0-1 heuristic confidence per AI output (null when AI is off)
        category: { type: Number, default: null },
        priority: { type: Number, default: null },
        sentiment: { type: Number, default: null },
    },
    aiSentimentBasis: { type: String, enum: ['cue', 'none'], default: null }, // 'none' = no cue word, label is a guess
    aiNeedsReview: { type: Boolean, default: false }, // a human should look at this complaint's triage
    aiReviewReasons: [{ type: String }],
    aiSafetyFlag: { type: Boolean, default: false },  // a deterministic safety rule matched
    aiEstimatedTime: { type: String, default: null },  // AI predicted resolution ETA
    aiIsDuplicate: { type: Boolean, default: false }, // Flag if AI thinks this is a duplicate
    aiDuplicateMatch: { type: Number, default: 0 },    // Percentage match to nearest existing complaint
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
complaintSchema.index({ aiNeedsReview: 1, status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
