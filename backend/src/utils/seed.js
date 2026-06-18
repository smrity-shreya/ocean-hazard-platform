require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const HazardReport = require('../models/HazardReport');

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await HazardReport.deleteMany({});

  const password = await bcrypt.hash('password123', 10);

  const [citizen, analyst, official] = await User.create([
    { name: 'Citizen Demo', email: 'user@demo.com', password, role: 'user' },
    { name: 'Analyst Demo', email: 'analyst@demo.com', password, role: 'analyst' },
    { name: 'Official Demo', email: 'official@demo.com', password, role: 'official' },
  ]);

  await HazardReport.create([
    {
      reportedBy: citizen._id,
      hazardType: 'high_waves',
      description: 'Unusually high waves near the harbor, fishing boats returning early.',
      severity: 'high',
      location: { lat: 13.0827, lng: 80.2707, placeName: 'Chennai Harbor' },
      status: 'pending',
    },
    {
      reportedBy: citizen._id,
      hazardType: 'flooding',
      description: 'Coastal road flooded due to high tide.',
      severity: 'medium',
      location: { lat: 13.09, lng: 80.28, placeName: 'Marina Beach Road' },
      status: 'verified',
      reviewedBy: analyst._id,
    },
  ]);

  console.log('Seed complete. Demo accounts (password: password123):');
  console.log('  user@demo.com / analyst@demo.com / official@demo.com');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
