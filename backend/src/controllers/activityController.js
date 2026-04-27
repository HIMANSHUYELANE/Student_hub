const Activity = require('../models/Activity');
const Student = require('../models/Student');

// POST /api/activities
const createActivity = async (req, res) => {
  try {
    const { category, name, title, date, description } = req.body;
    const activity = new Activity({ category, name, title, date, description, participants: [] });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/activities
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/activities/:id
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('participants.student', 'name rollNumber className');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/activities/:id/participate
const addParticipant = async (req, res) => {
  try {
    const { studentId, achievement } = req.body;
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if student already participating
    const existing = activity.participants.find(p => p.student.toString() === studentId);
    if (existing) {
      return res.status(400).json({ message: 'Student already added to this activity' });
    }

    activity.participants.push({ student: studentId, achievement: achievement || 'Participant' });
    await activity.save();

    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/activities/student/:studentId
const getStudentActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ 'participants.student': req.params.studentId })
      .sort({ date: -1 })
      .populate('participants.student', 'name rollNumber className');
    
    // Format response to make it easier for frontend
    const result = activities.map(act => {
      const participation = act.participants.find(p => p.student._id.toString() === req.params.studentId);
      return {
        _id: act._id,
        category: act.category,
        name: act.name,
        title: act.title,
        date: act.date,
        description: act.description,
        achievement: participation ? participation.achievement : null
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  addParticipant,
  getStudentActivities
};
