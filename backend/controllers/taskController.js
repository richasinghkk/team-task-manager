const Task = require('../models/Task');

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, dueDate, project } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo,
      dueDate,
      project
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Tasks for a Project
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task Status
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.assignedTo = req.body.assignedTo || task.assignedTo;
    task.dueDate = req.body.dueDate || task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Overdue Tasks
const getOverdueTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    }).populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getOverdueTasks
};