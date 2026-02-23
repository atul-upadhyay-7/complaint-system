require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Complaint = require('./models/Complaint');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing demo data
    await User.deleteMany({ email: { $in: ['admin@campus.edu', 'student@campus.edu'] } });

    // Create admin
    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@campus.edu',
        password: 'admin123',
        role: 'admin',
    });
    console.log('✅ Admin created: admin@campus.edu / admin123');

    // Create student
    const student = await User.create({
        name: 'Rahul Sharma',
        email: 'student@campus.edu',
        password: 'student123',
        role: 'student',
        rollNumber: '2021CS042',
        hostel: 'Block A',
    });
    console.log('✅ Student created: student@campus.edu / student123');

    // Create sample complaints
    const sampleComplaints = [
        { title: 'Water supply issue in Block A', description: 'No water supply since morning. The pipes seem to be blocked on the ground floor.', category: 'Water', priority: 'High', status: 'Pending', location: 'Block A - Ground Floor', student: student._id },
        { title: 'WiFi not working in Room 204', description: 'Internet connection has been down for 2 days. Cannot attend online classes.', category: 'Internet', priority: 'High', status: 'In Progress', assignedTo: 'IT Department', location: 'Block A Room 204', student: student._id },
        { title: 'Broken ceiling fan in common room', description: 'The ceiling fan in the common room stopped working and is making a rattling sound.', category: 'Maintenance', priority: 'Medium', status: 'Resolved', resolvedAt: new Date(), adminNotes: 'Fan replaced on 20th. All good now.', student: student._id },
        { title: 'Dirty washrooms on 2nd floor', description: 'Washrooms have not been cleaned for 3 days. Very unhygienic conditions.', category: 'Cleanliness', priority: 'High', status: 'Pending', location: '2nd Floor Washrooms', student: student._id },
        { title: 'Street light not working', description: 'The street light near the hostel gate has not been working for a week. Safety concern at night.', category: 'Electricity', priority: 'Medium', status: 'In Progress', assignedTo: 'Electrical Team', student: student._id },
    ];

    await Complaint.deleteMany({ student: student._id });
    await Complaint.insertMany(sampleComplaints);
    console.log(`✅ ${sampleComplaints.length} sample complaints created`);

    console.log('\n🚀 Seed complete! You can now log in with:');
    console.log('   Admin:   admin@campus.edu / admin123');
    console.log('   Student: student@campus.edu / student123\n');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
