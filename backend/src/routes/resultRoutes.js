const express = require('express');
const {
  addOrUpdateResult,
  getStudentResults
} = require('../controllers/resultController');
const { protect, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin adds or updates results
router.post('/', protect, requireRole('admin'), addOrUpdateResult);

// Admin and students (with known studentId) can view results
router.get('/student/:studentId', protect, getStudentResults);

module.exports = router;

