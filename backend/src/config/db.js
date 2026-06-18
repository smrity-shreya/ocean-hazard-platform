const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/arete_forge';
  try {
    await mongoose.connect(uri);
    console.log('[DB] MongoDB connected:', uri);
  } catch (err) {
    console.error('[DB] Connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
