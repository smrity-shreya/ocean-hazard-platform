const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  getZoneRisk,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// Specific routes before /:id to avoid route shadowing
router.get('/zones', protect, getZoneRisk);
router.get('/mine', protect, getMyReports);

router.post('/', protect, authorize('user'), createReport);
router.get('/', protect, authorize('analyst', 'official'), getReports);
router.get('/:id', protect, getReportById);
router.patch('/:id/status', protect, authorize('analyst', 'official'), updateReportStatus);

module.exports = router;
