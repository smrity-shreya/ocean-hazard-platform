const express = require('express');
const router = express.Router();
const { createAlert, getAlerts, deactivateAlert } = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('official'), createAlert);
router.get('/', protect, getAlerts);
router.patch('/:id/deactivate', protect, authorize('official'), deactivateAlert);

module.exports = router;
