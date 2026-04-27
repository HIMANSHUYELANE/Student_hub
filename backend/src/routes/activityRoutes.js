const express = require('express');
const {
  createActivity,
  getActivities,
  getActivityById,
  addParticipant,
  getStudentActivities
} = require('../controllers/activityController');
const { protect, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Admin routes
router.post('/', requireRole('admin'), createActivity);
router.post('/:id/participate', requireRole('admin'), addParticipant);

// Admin and Student routes
router.get('/', getActivities);
router.get('/:id', getActivityById);
router.get('/student/:studentId', getStudentActivities);

module.exports = router;
