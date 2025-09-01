'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

import { taskAPI } from '../services/api';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await taskAPI.getTasks(params);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure backend is running on port 5000.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save task (create or update)
  const saveTask = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setError('');
      const taskData = { title, description, status };
      
      if (editingId) {
        await taskAPI.updateTask(editingId, taskData);
      } else {
        await taskAPI.createTask(taskData);
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setStatus('pending');
      setEditingId(null);
      
      // Refresh tasks
      fetchTasks();
    } catch (err) {
      setError('Failed to save task');
      console.error('Error saving task:', err);
    }
  };

  // Edit task
  const editTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setEditingId(task._id);
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setEditingId(null);
    setError('');
  };

  // Get status badge styling
  const getStatusStyling = (status) => {
    switch (status) {
      case 'pending': 
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-700',
          icon: AlertCircle
        };
      case 'in-progress': 
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-700',
          icon: Clock
        };
      case 'completed': 
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-700',
          icon: CheckCircle2
        };
      default: 
        return {
          bg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-700',
          icon: AlertCircle
        };
    }
  };

  // Task stats
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length
  };

  // Load tasks when component mounts or filters change
  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Task Manager</h1>
              <p className="text-slate-600 mt-1">Organize and track your work efficiently</p>
            </div>
            <div className="hidden sm:flex items-center space-x-1 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
              <div className="px-3 py-2 text-sm font-medium text-slate-600">
                {taskStats.total} Total
              </div>
              <div className="px-3 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded">
                {taskStats.pending} Pending
              </div>
              <div className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded">
                {taskStats.inProgress} Active
              </div>
              <div className="px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded">
                {taskStats.completed} Done
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <Plus className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingId ? 'Edit Task' : 'Create Task'}
                </h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide additional details about this task"
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    onClick={saveTask}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update Task' : 'Add Task')}
                  </button>
                  
                  {editingId && (
                    <button
                      onClick={cancelEdit}
                      className="w-full mt-3 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List - Right Column */}
          <div className="lg:col-span-2">
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-40"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Tasks Overview
                  <span className="ml-2 text-sm font-normal text-slate-500">({tasks.length} total)</span>
                </h2>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      {search || statusFilter !== 'all' 
                        ? 'Try adjusting your search criteria or filter options'
                        : 'Get started by creating your first task using the form on the left'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => {
                      const statusStyle = getStatusStyling(task.status);
                      const StatusIcon = statusStyle.icon;
                      
                      return (
                        <div key={task._id} className="group border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                                  {task.title}
                                </h3>
                                <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text}`}>
                                  <StatusIcon className="h-3.5 w-3.5" />
                                  <span className="capitalize">{task.status.replace('-', ' ')}</span>
                                </div>
                              </div>
                              
                              <p className="text-slate-600 mb-4 leading-relaxed">
                                {task.description}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-xs text-slate-500">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>Created {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                {task.updatedAt !== task.createdAt && (
                                  <div className="flex items-center space-x-1">
                                    <Edit3 className="h-3.5 w-3.5" />
                                    <span>Updated {new Date(task.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => editTask(task)}
                                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="Edit task"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteTask(task._id)}
                                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Delete task"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;