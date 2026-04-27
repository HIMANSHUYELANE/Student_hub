const Attendance = require('../models/Attendance');
const Result = require('../models/Result');

const calculateAttendancePercentage = async (studentId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const records = await Attendance.find({
    student: studentId,
    date: { $gte: startOfMonth, $lte: endOfMonth }
  });

  const presentCount = records.filter((r) => r.status === 'present').length;
  // Calculate percentage based on a fixed 25 working days per month
  const percentage = Math.round((presentCount / 25) * 100);
  
  // Cap at 100% just in case presentCount > 25
  return percentage > 100 ? 100 : percentage;
};

const calculateAverageMarks = (result) => {
  if (!result || !result.subjects || !result.subjects.length) return 0;
  const totalPercentage = result.subjects.reduce((sum, s) => {
    const max = s.maxMarks || 100;
    return sum + ((s.marks / max) * 100);
  }, 0);
  return Math.round((totalPercentage / result.subjects.length) * 100) / 100;
};

const detectWeakSubjects = (result, threshold = 40) => {
  if (!result || !result.subjects) return [];
  return result.subjects
    .filter((s) => {
      const max = s.maxMarks || 100;
      return ((s.marks / max) * 100) < threshold;
    })
    .map((s) => ({ name: s.name, marks: s.marks, maxMarks: s.maxMarks || 100 }));
};

const calculateActivityScore = (activities) => {
  if (!activities || !activities.length) return 0;
  
  let score = 0;
  for (const act of activities) {
    const achievement = act.achievement;
    if (achievement === 'Winner') score += 25;
    else if (achievement?.includes('Runner-up')) score += 15;
    else if (achievement === 'Participant') score += 10;
  }
  
  return score > 100 ? 100 : score;
};

const getPerformanceLevel = (avgMarks, attendancePercentage, activityScore = 0) => {
  const combinedScore = (avgMarks * 0.70) + (attendancePercentage * 0.15) + (activityScore * 0.15);

  if (combinedScore >= 80) return 'Excellent';
  if (combinedScore >= 65) return 'Good';
  if (combinedScore >= 50) return 'Average';
  return 'Needs Improvement';
};

module.exports = {
  calculateAttendancePercentage,
  calculateAverageMarks,
  calculateActivityScore,
  detectWeakSubjects,
  getPerformanceLevel
};

