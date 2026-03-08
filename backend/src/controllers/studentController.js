const Student = require('../models/Student');
const User = require('../models/User');

// POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, rollNumber, className, email, phone, address } = req.body;

    const existing = await Student.findOne({ rollNumber });
    if (existing) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    const student = await Student.create({
      name,
      rollNumber,
      className,
      email,
      phone,
      address
    });

    // Optionally create linked user for login
    if (email) {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        const user = new User({
          name,
          email,
          password: rollNumber, // simple default; should be reset in production
          role: 'student',
          student: student._id
        });
        await user.save();
      }
    }

    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/students
const getStudents = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const updates = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await User.deleteOne({ student: student._id });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};

