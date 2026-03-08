const express = require('express');
const {
  markAttendance,
  getStudentAttendance
} = require('../controllers/attendanceController');
const { protect, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin marks attendance
router.post('/mark', protect, requireRole('admin'), markAttendance);

// Admin and students (with known studentId) can view attendance
router.get('/student/:studentId', protect, getStudentAttendance);

module.exports = router;

