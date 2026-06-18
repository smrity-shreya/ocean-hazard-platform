const HazardReport = require('../models/HazardReport');
const { computeZoneRisk } = require('../utils/zoneRisk');

// POST /api/reports  (role: user)
async function createReport(req, res, next) {
  try {
    const { hazardType, description, severity, lat, lng, placeName, mediaUrls } = req.body;

    if (!hazardType || !description || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'hazardType, description, lat and lng are required' });
    }

    const report = await HazardReport.create({
      reportedBy: req.user._id,
      hazardType,
      description,
      severity: severity || 'medium',
      location: { lat, lng, placeName: placeName || '' },
      mediaUrls: mediaUrls || [],
    });

    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports  (role: analyst, official) - all reports, filterable
async function getReports(req, res, next) {
  try {
    const { status, hazardType, severity } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (hazardType) filter.hazardType = hazardType;
    if (severity) filter.severity = severity;

    const reports = await HazardReport.find(filter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(500);

    res.json(reports);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/mine  (role: user) - reports submitted by the logged-in user
async function getMyReports(req, res, next) {
  try {
    const reports = await HazardReport.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/:id
async function getReportById(req, res, next) {
  try {
    const report = await HazardReport.findById(req.params.id).populate('reportedBy', 'name email');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/reports/:id/status  (role: analyst, official)
async function updateReportStatus(req, res, next) {
  try {
    const { status, reviewNote } = req.body;
    const allowed = ['pending', 'verified', 'rejected', 'escalated'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    const report = await HazardReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = status;
    report.reviewedBy = req.user._id;
    if (reviewNote) report.reviewNote = reviewNote;
    await report.save();

    res.json(report);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/zones - computed risk zones for map rendering
async function getZoneRisk(req, res, next) {
  try {
    const reports = await HazardReport.find({}, 'location severity status createdAt').lean();
    const zones = computeZoneRisk(reports);
    res.json(zones);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  getZoneRisk,
};
