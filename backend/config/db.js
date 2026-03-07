const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Only run seed if there are no users at all (first-time setup)
    const User = require('../models/User');
    const userCount = await User.countDocuments();

    if (userCount === 0 || process.env.RUN_SEED === 'true') {
      console.log('🔄 Empty database detected. Running seed script...');
      const seedDB = require('../seed');
      await seedDB();
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
