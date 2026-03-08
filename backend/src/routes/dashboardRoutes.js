const express = require('express');
const {
  getAdminDashboard,
  getStudentDashboard
} = require('../controllers/dashboardController');
const { protect, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin dashboard
router.get('/admin', protect , requireRole('admin'), getAdminDashboard);

// Student dashboard (student or admin with known studentId)
router.get('/student/:studentId', protect, getStudentDashboard);

module.exports = router;

