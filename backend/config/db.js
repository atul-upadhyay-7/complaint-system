const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
      console.log('🔄 Local MongoDB not found, starting In-Memory MongoDB Server...');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();

      // Auto-run seeder if we are using memory server
      process.env.RUN_SEED = 'true';
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    if (process.env.RUN_SEED === 'true') {
      try {
        const seedDB = require('../seed');
        await seedDB();
      } catch (err) {
        console.log('Seed file not found or failed to run:', err.message);
      }
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
