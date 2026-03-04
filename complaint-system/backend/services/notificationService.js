// Notification Service — emits Socket.io real-time events
// The io instance is set by server.js after Socket.io initialization

let _io = null;

const setIO = (io) => { _io = io; };

const emit = (event, payload) => {
    if (_io) {
        _io.emit(event, payload);
    }
};

const notifyComplaintCreated = (complaint, studentName) => {
    emit('complaint:created', {
        complaintId: complaint._id,
        title: complaint.title,
        category: complaint.category,
        priority: complaint.priority,
        studentName,
    });
};

const notifyComplaintAssigned = (complaint, assigneeName) => {
    emit('complaint:assigned', {
        complaintId: complaint._id,
        title: complaint.title,
        assignedTo: assigneeName || complaint.assignedToName,
    });
};

const notifyStatusChanged = (complaint, oldStatus) => {
    emit('complaint:statusChanged', {
        complaintId: complaint._id,
        title: complaint.title,
        oldStatus,
        newStatus: complaint.status,
    });

    if (complaint.status === 'Resolved') {
        const resolutionMs = complaint.resolvedAt - complaint.createdAt;
        const resolutionHours = Math.round(resolutionMs / (1000 * 60 * 60));
        emit('complaint:resolved', {
            complaintId: complaint._id,
            title: complaint.title,
            resolutionTimeHours: resolutionHours,
        });
    }
};

module.exports = { setIO, notifyComplaintCreated, notifyComplaintAssigned, notifyStatusChanged };
