const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    marks: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true, default: 100 }
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    term: { type: String, required: true, trim: true },
    subjects: [subjectSchema]
  },
  { timestamps: true }
);

resultSchema.index({ student: 1, term: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);

