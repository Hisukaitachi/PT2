const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
// Import controller functions


// GET /api/tasks - Get all tasks with optional search and filter
router.get('/',  taskController.getTasks);

// GET /api/tasks/:id - Get single task by ID
router.get('/:id', taskController.getTaskById);

// POST /api/tasks - Create new task
router.post('/', taskController.createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;