const Result = require('../models/Result');

// POST /api/results
// Body: { studentId, term, subjects: [{ name, marks }] }
const addOrUpdateResult = async (req, res) => {
  const { studentId, term, subjects } = req.body;
  if (!studentId || !term || !Array.isArray(subjects)) {
    return res
      .status(400)
      .json({ message: 'studentId, term and subjects are required' });
  }

  try {
    const result = await Result.findOneAndUpdate(
      { student: studentId, term },
      { $set: { subjects } },
      { new: true, upsert: true }
    );

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/results/student/:studentId
const getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    const results = await Result.find({ student: studentId }).sort({
      createdAt: -1
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addOrUpdateResult,
  getStudentResults
};

