const Attendance = require('../models/Attendance');

// POST /api/attendance/mark
// Body: { date, records: [{ studentId, status }] }
const markAttendance = async (req, res) => {
  const { date, records } = req.body;
  if (!date || !Array.isArray(records)) {
    return res.status(400).json({ message: 'Date and records are required' });
  }

  try {
    const attendanceDate = new Date(date);

    const ops = records.map((r) => ({
      updateOne: {
        filter: { student: r.studentId, date: attendanceDate },
        update: { $set: { status: r.status } },
        upsert: true
      }
    }));

    if (ops.length) {
      await Attendance.bulkWrite(ops);
    }

    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/attendance/student/:studentId
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await Attendance.find({ student: studentId }).sort({
      date: 1
    });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  markAttendance,
  getStudentAttendance
};

