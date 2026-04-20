const mongoose = require('mongoose');

const todo = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date
    },
    completed: {
      type: Boolean,
      default: false
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Todo', todo);
