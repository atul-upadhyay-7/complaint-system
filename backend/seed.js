require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const ComplaintHistory = require('./models/ComplaintHistory');

async function seed() {
    console.log('✅ Starting DB seed process...');

    // Clear existing demo data
    const demoEmails = ['admin@campus.edu', 'student@campus.edu', 'tech@campus.edu', 'warden@campus.edu'];
    await User.deleteMany({ email: { $in: demoEmails } });

    // Admin
    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@campus.edu',
        password: 'admin123',
        role: 'admin',
    });

    // Student
    const student = await User.create({
        name: 'Rahul Sharma',
        email: 'student@campus.edu',
        password: 'student123',
        role: 'student',
        rollNumber: '2021CS042',
        hostel: 'Block A',
    });

    // Technician
    const technician = await User.create({
        name: 'Suresh Kumar',
        email: 'tech@campus.edu',
        password: 'tech123',
        role: 'technician',
        department: 'Electrical & Maintenance',
    });

    // Warden
    const warden = await User.create({
        name: 'Dr. Priya Singh',
        email: 'warden@campus.edu',
        password: 'warden123',
        role: 'warden',
        department: 'Hostel Administration',
        hostel: 'Block A',
    });

    console.log('✅ Users created');

    // Delete old sample complaints
    await Complaint.deleteMany({ student: student._id });

    // Sample complaints
    const complaints = await Complaint.insertMany([
        {
            title: 'Major Water Leakage in Room 102',
            description: 'The overhead pipe burst and the room is completely flooded. Need urgent help!',
            category: 'Water',
            priority: 'Critical',
            status: 'Pending',
            location: 'Block A - Room 102',
            student: student._id,
            aiCategory: 'Water',
            aiPriority: 'Critical',
            aiSentiment: 'Urgent',
            aiEstimatedTime: '1 hour'
        },
        {
            title: 'WiFi Down in Block B Library',
            description: 'The internet has been disconnected since morning. Very frustrating for research.',
            category: 'Internet',
            priority: 'High',
            status: 'Assigned',
            assignedTo: technician._id,
            assignedToName: technician.name,
            location: 'Block B Library',
            student: student._id,
            aiCategory: 'Internet',
            aiPriority: 'High',
            aiSentiment: 'Frustrated',
            aiEstimatedTime: '6-12 hours'
        },
        {
            title: 'Broken tube light in corridor',
            description: 'The light near the lift is flickering. Please replace it kindly.',
            category: 'Electricity',
            priority: 'Low',
            status: 'Resolved',
            resolvedAt: new Date(),
            adminNotes: 'Bulb replaced by tech.',
            assignedTo: technician._id,
            assignedToName: technician.name,
            student: student._id,
            aiCategory: 'Electricity',
            aiPriority: 'Low',
            aiSentiment: 'Polite',
            aiEstimatedTime: '2 days'
        },
        {
            title: 'Cockroach infestation in Mess',
            description: 'Found cockroaches in the food today. This is disgusting and unhygienic.',
            category: 'Cleanliness',
            priority: 'High',
            status: 'In Progress',
            location: 'Hostel Mess',
            student: student._id,
            aiCategory: 'Cleanliness',
            aiPriority: 'High',
            aiSentiment: 'Urgent',
            aiEstimatedTime: '4-8 hours'
        },
        {
            title: 'Door lock jammed',
            description: 'The lock of room 305 is not turning properly.',
            category: 'Maintenance',
            priority: 'Medium',
            status: 'In Progress',
            assignedTo: technician._id,
            assignedToName: technician.name,
            student: student._id,
            aiCategory: 'Maintenance',
            aiPriority: 'Medium',
            aiSentiment: 'Neutral',
            aiEstimatedTime: '2 days'
        },
    ]);

    console.log(`✅ ${complaints.length} complaints created`);

    // Seed complaint history
    await ComplaintHistory.deleteMany({ complaint: { $in: complaints.map(c => c._id) } });

    const historyEntries = [];
    for (const c of complaints) {
        historyEntries.push({
            complaint: c._id,
            action: 'created',
            performedBy: student._id,
            newValue: { title: c.title, category: c.category, priority: c.priority },
        });
        if (c.status !== 'Pending') {
            historyEntries.push({
                complaint: c._id,
                action: 'status_changed',
                performedBy: admin._id,
                oldValue: 'Pending',
                newValue: c.status,
            });
        }
        if (c.assignedTo) {
            historyEntries.push({
                complaint: c._id,
                action: 'assigned',
                performedBy: admin._id,
                newValue: technician._id,
                note: `Assigned to ${technician.name}`,
            });
        }
    }
    await ComplaintHistory.insertMany(historyEntries);
    console.log(`✅ ${historyEntries.length} history entries created`);

    console.log('\n🚀 Seed complete! Login credentials:');
    console.log('   Admin:      admin@campus.edu   / admin123');
    console.log('   Student:    student@campus.edu / student123');
    console.log('   Technician: tech@campus.edu    / tech123');
    console.log('   Warden:     warden@campus.edu  / warden123\n');

    console.log('✅ Seed Complete!\n');
}

if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => seed())
        .then(() => {
            mongoose.disconnect();
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
} else {
    module.exports = seed;
}
