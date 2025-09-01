const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'completed'],
      message: 'Status must be either pending, in-progress, or completed'
    },
    default: 'pending'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be either low, medium, or high'
    },
    default: 'medium'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This automatically manages createdAt and updatedAt
});

// Indexes for better query performance
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ status: 1 });
taskSchema.index({ createdAt: -1 });

// Instance methods
taskSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  return this.save();
};

taskSchema.methods.markAsInProgress = function() {
  this.status = 'in-progress';
  return this.save();
};

// Static methods
taskSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

taskSchema.statics.searchTasks = function(searchTerm) {
  return this.find({
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } }
    ]
  });
};

// Virtual for task summary
taskSchema.virtual('summary').get(function() {
  return `${this.title} - ${this.status}`;
});

// Ensure virtual fields are serialized
taskSchema.set('toJSON', {
  virtuals: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;