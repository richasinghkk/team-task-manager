import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FiFolder, FiCheckCircle, FiAlertCircle, FiList, FiPlus, FiSearch, FiMoon, FiSun, FiLogOut, FiTrash2, FiEye } from 'react-icons/fi';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, overdueTasks: 0, totalProjects: 0 });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const filtered = projects.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [search, projects]);

  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects');
      const projectList = Array.isArray(response.data) ? response.data : [];
      setProjects(projectList);
      setFilteredProjects(projectList);
      await fetchAllStats(projectList);
    } catch (error) {
      console.log('Project fetch error:', error);
      setProjects([]);
      setFilteredProjects([]);
    }
  };

  const fetchAllStats = async (projectList) => {
    try {
      if (!projectList || projectList.length === 0) {
        setStats({ totalProjects: 0, totalTasks: 0, completedTasks: 0, overdueTasks: 0 });
        return;
      }

      let totalTasks = 0;
      let completedTasks = 0;
      let overdueTasks = 0;
      let inProgressTasks = 0;
      let todoTasks = 0;
      const barData = [];

      for (let project of projectList) {
        try {
          const response = await API.get(`/tasks/${project._id}`);
          const taskList = Array.isArray(response.data) ? response.data : [];
          const completed = taskList.filter(t => t.status === 'completed').length;
          const inProgress = taskList.filter(t => t.status === 'inprogress').length;
          const todo = taskList.filter(t => t.status === 'todo').length;
          const overdue = taskList.filter(t =>
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
          ).length;

          totalTasks += taskList.length;
          completedTasks += completed;
          overdueTasks += overdue;
          inProgressTasks += inProgress;
          todoTasks += todo;

          barData.push({
            name: project.name.length > 10 ? project.name.substring(0, 10) + '...' : project.name,
            Total: taskList.length,
            Completed: completed,
            Overdue: overdue
          });
        } catch (err) {
          console.log('Task fetch error:', err);
        }
      }

      setStats({ totalProjects: projectList.length, totalTasks, completedTasks, overdueTasks });
      setChartData(barData);
      setPieData([
        { name: 'Completed', value: completedTasks },
        { name: 'In Progress', value: inProgressTasks },
        { name: 'Todo', value: todoTasks },
        { name: 'Overdue', value: overdueTasks }
      ]);
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
    if (!window.confirm('Are you sure you want to delete this project?')) return;
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
        <div className="navbar-brand">
          <span style={{fontSize: '24px'}}>📋</span>
          <h1>TaskManager</h1>
        </div>
        <div className="nav-right">
          <button onClick={() => setDarkMode(!darkMode)} className="dark-toggle">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <div className="nav-user">
            <div className="nav-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{user?.name}</span>
            <span className="nav-role">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <FiLogOut />
          </button>
        </div>
      </nav>

      <div className="dashboard-content">

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">📁</div>
            <div className="stat-info">
              <h3>{stats.totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">📋</div>
            <div className="stat-info">
              <h3>{stats.totalTasks}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-info">
              <h3>{stats.completedTasks}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">⚠️</div>
            <div className="stat-info">
              <h3>{stats.overdueTasks}</h3>
              <p>Overdue</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="charts-grid">
            <div className="chart-card">
              <h3>📊 Tasks per Project</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="Total" fill="#6366f1" radius={[4,4,0,0]} />
                  <Bar dataKey="Completed" fill="#10b981" radius={[4,4,0,0]} />
                  <Bar dataKey="Overdue" fill="#ef4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>🍩 Task Status Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Projects Header */}
        <div className="dashboard-header">
          <h2>My Projects</h2>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{width: 'auto'}}>
              <FiPlus /> New Project
            </button>
          )}
        </div>

        {/* Search */}
        <div className="search-filter-bar">
          <div className="search-wrapper">
            <span className="search-icon"><FiSearch /></span>
            <input
              type="text"
              className="search-input"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Create Project Form */}
        {showForm && (
          <div className="form-card">
            <h3>✨ Create New Project</h3>
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
              <button type="submit" className="btn-primary" style={{width: 'auto'}}>
                <FiPlus /> Create Project
              </button>
            </form>
          </div>
        )}

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.length === 0 ? (
            <div className="no-data">
              <span className="no-data-icon">📁</span>
              <p>{search ? 'No projects match your search' : 'No projects yet. Create one to get started!'}</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project._id} className="project-card">
                <h3>{project.name}</h3>
                <p>{project.description || 'No description'}</p>
                <div className="project-meta">
                  <span className="members">
                    👥 {project.members?.length || 0} members
                  </span>
                </div>
                <div className="card-actions">
                  <button
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="btn-primary">
                    <FiEye /> View Tasks
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="btn-danger">
                      <FiTrash2 /> Delete
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