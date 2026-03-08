const Attendance = require('../models/Attendance');
const Result = require('../models/Result');

const calculateAttendancePercentage = async (studentId) => {
  const records = await Attendance.find({ student: studentId });
  if (!records.length) return 0;
  const presentCount = records.filter((r) => r.status === 'present').length;
  return Math.round((presentCount / records.length) * 100);
};

const calculateAverageMarks = (result) => {
  if (!result || !result.subjects || !result.subjects.length) return 0;
  const total = result.subjects.reduce((sum, s) => sum + (s.marks || 0), 0);
  return Math.round((total / result.subjects.length) * 100) / 100;
};

const detectWeakSubjects = (result, threshold = 40) => {
  if (!result || !result.subjects) return [];
  return result.subjects
    .filter((s) => s.marks < threshold)
    .map((s) => ({ name: s.name, marks: s.marks }));
};

const getPerformanceLevel = (avgMarks, attendancePercentage) => {
  const combinedScore = avgMarks * 0.7 + attendancePercentage * 0.3;

  if (combinedScore >= 80) return 'Excellent';
  if (combinedScore >= 65) return 'Good';
  if (combinedScore >= 50) return 'Average';
  return 'Needs Improvement';
};

module.exports = {
  calculateAttendancePercentage,
  calculateAverageMarks,
  detectWeakSubjects,
  getPerformanceLevel
};

