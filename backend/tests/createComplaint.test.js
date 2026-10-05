process.env.NODE_ENV = 'production';
const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const ComplaintHistory = require('../models/ComplaintHistory');

// Stub persistence so the service logic runs without a database.
const created = [];
Complaint.find = () => ({ limit: () => ({ sort: async () => [] }) });
Complaint.create = async (doc) => {
    const c = new Complaint(doc);
    const err = c.validateSync();
    if (err) throw err;
    created.push(c);
    c.populate = async () => c;
    return c;
};
ComplaintHistory.create = async () => ({});
const notification = require('../services/notificationService');
for (const k of Object.keys(notification)) if (typeof notification[k] === 'function') notification[k] = () => {};
const emailPath = require.resolve('../utils/sendEmail');
require.cache[emailPath] = { id: emailPath, filename: emailPath, loaded: true, exports: async () => {} };

const service = require('../services/complaintService');
const student = { _id: new mongoose.Types.ObjectId(), name: 'Test', email: 't@campus.edu' };

test('createComplaint stores a schema-valid assessment and raises safety complaints', async () => {
    const c = await service.createComplaint({ title: 'Sparking socket', description: 'Sparks from the socket near my bed, smell of burning plastic', category: 'Electricity' }, student);
    assert.equal(c.aiSafetyFlag, true);
    assert.equal(c.aiNeedsReview, true);
    assert.ok(['High', 'Critical'].includes(c.priority));
    assert.ok(c.aiReviewReasons.length > 0);
    assert.equal(typeof c.aiConfidence.category, 'number');
});

test('student priority is respected and never lowered', async () => {
    const c = await service.createComplaint({ title: 'Light is slightly dim', description: 'Corridor light is dim', category: 'Electricity', priority: 'High' }, student);
    assert.equal(c.priority, 'High');
});

test('with AI disabled the complaint is still created, priority falls back to Medium and it is flagged', async () => {
    process.env.AI_ENABLED = 'false';
    try {
        const c = await service.createComplaint({ title: 'Fan not working', description: 'Fan in room 12 is not working', category: 'Electricity' }, student);
        assert.equal(c.priority, 'Medium');
        assert.equal(c.aiNeedsReview, true);
        assert.equal(c.aiCategory, null);
        assert.equal(c.category, 'Electricity');
    } finally { delete process.env.AI_ENABLED; }
});
