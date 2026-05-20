import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalProjects: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects');
      let projectList = [];
      if (response && response.data) {
        projectList = Array.isArray(response.data) ? response.data : [];
      }
      setProjects(projectList);
      await fetchAllStats(projectList);
    } catch (error) {
      console.log('Project fetch error:', error);
      setProjects([]);
    }
  };

  const fetchAllStats = async (projectList) => {
    try {
      if (!projectList || !Array.isArray(projectList) || projectList.length === 0) {
        setStats({
          totalProjects: 0,
          totalTasks: 0,
          completedTasks: 0,
          overdueTasks: 0
        });
        return;
      }

      let totalTasks = 0;
      let completedTasks = 0;
      let overdueTasks = 0;

      for (let i = 0; i < projectList.length; i++) {
        try {
          const response = await API.get(`/tasks/${projectList[i]._id}`);
          let taskList = [];
          if (response && response.data) {
            taskList = Array.isArray(response.data) ? response.data : [];
          }
          totalTasks += taskList.length;
          for (let j = 0; j < taskList.length; j++) {
            if (taskList[j].status === 'completed') completedTasks++;
            if (
              taskList[j].dueDate &&
              new Date(taskList[j].dueDate) < new Date() &&
              taskList[j].status !== 'completed'
            ) overdueTasks++;
          }
        } catch (err) {
          console.log('Task fetch error:', err);
        }
      }

      setStats({
        totalProjects: projectList.length,
        totalTasks,
        completedTasks,
        overdueTasks
      });
    } catch (error) {
      console.log('Stats error:', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', newProject);
      toast.success('Project created!');
      setShowForm(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Project deleted!');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>📋 Task Manager</h1>
        <div className="nav-right">
          <span>👤 {user?.name} ({user?.role})</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalProjects}</h3>
            <p>Total Projects</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-card green">
            <h3>{stats.completedTasks}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card red">
            <h3>{stats.overdueTasks}</h3>
            <p>Overdue</p>
          </div>
        </div>

        <div className="dashboard-header">
          <h2>My Projects</h2>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              + New Project
            </button>
          )}
        </div>

        {showForm && (
          <div className="form-card">
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter project description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-primary">Create Project</button>
            </form>
          </div>
        )}

        <div className="projects-grid">
          {projects.length === 0 ? (
            <p className="no-data">No projects yet. Create one to get started!</p>
          ) : (
            projects.map((project) => (
              <div key={project._id} className="project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p className="members">👥 {project.members?.length} members</p>
                <div className="card-actions">
                  <button
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="btn-primary">
                    View Tasks
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="btn-danger">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;