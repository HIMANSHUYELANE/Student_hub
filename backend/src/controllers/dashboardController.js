const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const {
  calculateAttendancePercentage,
  calculateAverageMarks,
  detectWeakSubjects,
  getPerformanceLevel
} = require('../utils/performanceUtils');

// GET /api/dashboard/admin
const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const todayAttendance = await Attendance.find({
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    const presentCount = todayAttendance.filter(
      (r) => r.status === 'present'
    ).length;
    const absentCount = todayAttendance.filter(
      (r) => r.status === 'absent'
    ).length;

    const attendanceSummary = {
      present: presentCount,
      absent: absentCount,
      totalMarked: todayAttendance.length
    };

    const results = await Result.find({});
    const performanceBuckets = {
      Excellent: 0,
      Good: 0,
      Average: 0,
      'Needs Improvement': 0
    };

    for (const result of results) {
      const avgMarks = calculateAverageMarks(result);
      const attendancePercentage = await calculateAttendancePercentage(
        result.student
      );
      const level = getPerformanceLevel(avgMarks, attendancePercentage);
      performanceBuckets[level] = (performanceBuckets[level] || 0) + 1;
    }

    res.json({
      totalStudents,
      attendanceSummary,
      performanceOverview: performanceBuckets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/dashboard/student/:studentId
const getStudentDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendancePercentage = await calculateAttendancePercentage(studentId);

    const results = await Result.find({ student: studentId }).sort({
      createdAt: -1
    });
    const latestResult = results[0] || null;
    const avgMarks = latestResult
      ? calculateAverageMarks(latestResult)
      : 0;
    const weakSubjects = latestResult
      ? detectWeakSubjects(latestResult)
      : [];
    const performanceLevel = getPerformanceLevel(
      avgMarks,
      attendancePercentage
    );

    res.json({
      student,
      attendancePercentage,
      latestResult,
      avgMarks,
      weakSubjects,
      performanceLevel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdminDashboard,
  getStudentDashboard
};

