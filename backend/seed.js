require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const ComplaintHistory = require('./models/ComplaintHistory');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

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
            title: 'Water supply issue in Block A',
            description: 'No water supply since morning. The pipes seem to be blocked on the ground floor.',
            category: 'Water',
            priority: 'High',
            status: 'Pending',
            location: 'Block A - Ground Floor',
            student: student._id,
        },
        {
            title: 'WiFi not working in Room 204',
            description: 'Internet connection has been down for 2 days. Cannot attend online classes.',
            category: 'Internet',
            priority: 'High',
            status: 'Assigned',
            assignedTo: technician._id,
            assignedToName: technician.name,
            location: 'Block A Room 204',
            student: student._id,
        },
        {
            title: 'Broken ceiling fan in common room',
            description: 'The ceiling fan in the common room stopped working and is making a rattling sound.',
            category: 'Maintenance',
            priority: 'Medium',
            status: 'Resolved',
            resolvedAt: new Date(),
            adminNotes: 'Fan replaced on 20th. All good now.',
            assignedTo: technician._id,
            assignedToName: technician.name,
            student: student._id,
        },
        {
            title: 'Dirty washrooms on 2nd floor',
            description: 'Washrooms have not been cleaned for 3 days. Very unhygienic conditions.',
            category: 'Cleanliness',
            priority: 'High',
            status: 'In Progress',
            location: '2nd Floor Washrooms',
            student: student._id,
        },
        {
            title: 'Street light not working',
            description: 'The street light near the hostel gate has not been working for a week. Safety concern at night.',
            category: 'Electricity',
            priority: 'Medium',
            status: 'In Progress',
            assignedTo: technician._id,
            assignedToName: technician.name,
            student: student._id,
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

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
