const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'must provide name'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    tags: {
      type: [String],
      default: [],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrence: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
      },
      interval: {
        type: Number,
        default: 1,
      },
      daysOfWeek: {
        type: [String],
        default: [],
      },
      endDate: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
