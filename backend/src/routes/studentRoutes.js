const express = require('express');
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// All student management routes are admin-only
router.use(protect, requireRole('admin'));

// POST /api/students
router.post('/', createStudent);

// GET /api/students
router.get('/', getStudents);

// GET /api/students/:id
router.get('/:id', getStudentById);

// PUT /api/students/:id
router.put('/:id', updateStudent);

// DELETE /api/students/:id
router.delete('/:id', deleteStudent);

module.exports = router;

