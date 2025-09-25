const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true,'must provide name'],
    trim: true
  },
  completed:{
    type: Boolean,
    default: false
  },
  priority:{
    type: String,
    enum: ['low','medium','high'],
    default: 'medium'
  }
},{timestamps: true});

module.exports = mongoose.model('Task',TaskSchema);