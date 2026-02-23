const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 100,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: 1000,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Electricity', 'Water', 'Cleanliness', 'Maintenance', 'Internet', 'Security', 'Food', 'Other'],
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: String,
        trim: true,
        default: null,
    },
    location: {
        type: String,
        trim: true,
    },
    resolvedAt: {
        type: Date,
        default: null,
    },
    adminNotes: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
