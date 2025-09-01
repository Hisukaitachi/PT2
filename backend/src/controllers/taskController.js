// In-memory storage (no database needed for testing)
let tasks = [
  {
    _id: '1',
    title: 'Sample Task',
    description: 'This is a sample task',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let nextId = 2;

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const { search, status } = req.query;
    let result = [...tasks];

    if (status && status !== 'all') {
      result = result.filter(task => task.status === status);
    }

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(s) ||
        task.description.toLowerCase().includes(s)
      );
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single task
const getTaskById = async (req, res) => {
  try {
    const task = tasks.find(t => t._id === req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description required' });
    }

    const newTask = {
      _id: nextId.toString(),
      title,
      description,
      status: status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    tasks.push(newTask);
    nextId++;
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    const taskIndex = tasks.findIndex(t => t._id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description: description || tasks[taskIndex].description,
      status: status || tasks[taskIndex].status,
      updatedAt: new Date()
    };

    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const taskIndex = tasks.findIndex(t => t._id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};