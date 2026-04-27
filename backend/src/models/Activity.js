const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Sports', 'Cultural', 'Technical']
    },
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    date: { type: Date, required: true },
    description: { type: String, trim: true },
    participants: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        achievement: {
          type: String,
          enum: ['Participant', 'Winner', 'Runner-up', '1st Runner-up', '2nd Runner-up'],
          default: 'Participant'
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
