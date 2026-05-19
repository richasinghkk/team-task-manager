const Project = require('../models/Project');

// Create Project
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id]
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Projects
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find({ admin: req.user._id })
        .populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id })
        .populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email')
      .populate('admin', 'name email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Member to Project
const addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (!project.members.includes(req.body.userId)) {
      project.members.push(req.body.userId);
      await project.save();
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  addMember,
  deleteProject
};