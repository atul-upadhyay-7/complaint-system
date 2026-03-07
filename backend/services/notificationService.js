// Notification Service — emits Socket.io real-time events to specific user rooms
let _io = null;

const setIO = (io) => { _io = io; };

// Emit to a specific user room or broadcast to all
const emitToRoom = (room, event, payload) => {
    if (_io) _io.to(room).emit(event, payload);
};
const emitAll = (event, payload) => {
    if (_io) _io.emit(event, payload);
};

const notifyComplaintCreated = (complaint, studentName) => {
    // Broadcast to all admins/wardens — they listen on this event
    emitAll('complaint:created', {
        complaintId: complaint._id,
        title: complaint.title,
        category: complaint.category,
        priority: complaint.priority,
        studentName,
    });
};

const notifyComplaintAssigned = (complaint, assigneeName) => {
    const payload = {
        complaintId: complaint._id,
        title: complaint.title,
        assignedTo: assigneeName || complaint.assignedToName,
    };

    // Notify the technician directly if we have their ID
    if (complaint.assignedTo) {
        emitToRoom(`user:${complaint.assignedTo}`, 'complaint:assigned', payload);
    } else {
        emitAll('complaint:assigned', payload);
    }
};

const notifyStatusChanged = (complaint, oldStatus, studentId) => {
    const payload = {
        complaintId: complaint._id,
        title: complaint.title,
        oldStatus,
        newStatus: complaint.status,
    };

    // Notify the specific student if we have their id
    if (studentId) {
        emitToRoom(`user:${studentId}`, 'complaint:statusChanged', payload);
    } else {
        emitAll('complaint:statusChanged', payload);
    }

    if (complaint.status === 'Resolved') {
        const resolvedAt = complaint.resolvedAt || new Date();
        const resolutionMs = resolvedAt - complaint.createdAt;
        const resolutionHours = Math.max(0, Math.round(resolutionMs / (1000 * 60 * 60)));
        const resolvedPayload = {
            complaintId: complaint._id,
            title: complaint.title,
            resolutionTimeHours: resolutionHours,
        };
        if (studentId) {
            emitToRoom(`user:${studentId}`, 'complaint:resolved', resolvedPayload);
        } else {
            emitAll('complaint:resolved', resolvedPayload);
        }
    }
};

module.exports = { setIO, notifyComplaintCreated, notifyComplaintAssigned, notifyStatusChanged };
