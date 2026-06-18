const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true, maxlength: 2000 },
    zone: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      radiusKm: { type: Number, default: 5 },
    },
    severity: {
      type: String,
      enum: ['green', 'yellow', 'red'],
      default: 'yellow',
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
