const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
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
todoSchema.index({ text: 'text' });

module.exports = mongoose.model('Todo', todoSchema);
