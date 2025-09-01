const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database configuration
const connectDB = require('./config/db');

// Import routes


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', require('./routes/taskRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Task Manager API is running!', status: 'OK' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});