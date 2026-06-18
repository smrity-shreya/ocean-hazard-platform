const Alert = require('../models/Alert');

// POST /api/alerts (role: official)
async function createAlert(req, res, next) {
  try {
    const { title, message, lat, lng, radiusKm, severity } = req.body;
    if (!title || !message || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'title, message, lat, lng are required' });
    }

    const alert = await Alert.create({
      issuedBy: req.user._id,
      title,
      message,
      zone: { lat, lng, radiusKm: radiusKm || 5 },
      severity: severity || 'yellow',
    });

    res.status(201).json(alert);
  } catch (err) {
    next(err);
  }
}

// GET /api/alerts - active alerts visible to everyone
async function getAlerts(req, res, next) {
  try {
    const alerts = await Alert.find({ active: true }).sort({ createdAt: -1 }).limit(100);
    res.json(alerts);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/alerts/:id/deactivate (role: official)
async function deactivateAlert(req, res, next) {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    alert.active = false;
    await alert.save();
    res.json(alert);
  } catch (err) {
    next(err);
  }
}

module.exports = { createAlert, getAlerts, deactivateAlert };
