const mongoose = require('mongoose');

const hazardReportSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hazardType: {
      type: String,
      enum: ['flooding', 'high_waves', 'unusual_sea_activity', 'oil_spill', 'stranded_animal', 'erosion', 'other'],
      required: true,
    },
    description: { type: String, required: true, maxlength: 2000 },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      placeName: { type: String, default: '' },
    },
    mediaUrls: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'escalated'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewNote: { type: String, default: '' },
  },
  { timestamps: true }
);

hazardReportSchema.index({ 'location.lat': 1, 'location.lng': 1 });
hazardReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('HazardReport', hazardReportSchema);
