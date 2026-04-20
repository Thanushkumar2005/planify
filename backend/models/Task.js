const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  dueAt: {
    type: Date,
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Task", TaskSchema);