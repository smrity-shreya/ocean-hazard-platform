const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'analyst', 'official'],
      default: 'user',
    },
    phone: { type: String, trim: true },
    preferredLanguage: { type: String, default: 'en' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
