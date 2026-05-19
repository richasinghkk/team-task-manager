import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProjectTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'medium',
    dueDate: '', assignedTo: ''
  });
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await API.get(`/projects/${id}`);
      setProject(data);
      setMembers(data.members || []);
    } catch (error) {
      toast.error('Failed to fetch project');
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await API.get(`/tasks/${id}`);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', { ...newTask, project: id });
      toast.success('Task created!');
      setShowTaskForm(false);
      setNewTask({
        title: '', description: '', priority: 'medium',
        dueDate: '', assignedTo: ''
      });
      fetchTasks();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const { data: userData } = await API.get(`/auth/user-by-email?email=${newMemberEmail}`);
      await API.put(`/projects/${id}/addmember`, { userId: userData._id });
      toast.success('Member added!');
      setShowMemberForm(false);
      setNewMemberEmail('');
      fetchProject();
    } catch (error) {
      toast.error('User not found or already a member');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      toast.success('Status updated!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success('Task deleted!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'status-completed';
    if (status === 'inprogress') return 'status-inprogress';
    return 'status-todo';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'priority-high';
    if (priority === 'medium') return 'priority-medium';
    return 'priority-low';
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>📋 {project?.name || 'Project Tasks'}</h1>
        <div className="nav-right">
          <span>👤 {user?.name}</span>
          <button onClick={() => navigate('/dashboard')} className="btn-logout">
            ← Back
          </button>
        </div>
      </nav>

      <div className="dashboard-content">

        {/* Project Members */}
        <div className="members-section">
          <div className="dashboard-header">
            <h3>👥 Team Members ({members.length})</h3>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowMemberForm(!showMemberForm)}
                className="btn-secondary">
                + Add Member
              </button>
            )}
          </div>
          <div className="members-list">
            {members.map((member) => (
              <span key={member._id} className="member-badge">
                👤 {member.name}
              </span>
            ))}
          </div>

          {showMemberForm && (
            <div className="form-card" style={{marginTop: '16px'}}>
              <h3>Add Member by Email</h3>
              <form onSubmit={handleAddMember}>
                <div className="form-group">
                  <label>Member Email</label>
                  <input
                    type="email"
                    placeholder="Enter member's email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">Add Member</button>
              </form>
            </div>
          )}
        </div>

        <div className="dashboard-header">
          <h2>Tasks</h2>
          {user?.role === 'admin' && (
            <button onClick={() => setShowTaskForm(!showTaskForm)} className="btn-primary">
              + New Task
            </button>
          )}
        </div>

        {showTaskForm && (
          <div className="form-card">
            <h3>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}>
                  <option value="">-- Select Member --</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-primary">Create Task</button>
            </form>
          </div>
        )}

        <div className="tasks-grid">
          {tasks.length === 0 ? (
            <p className="no-data">No tasks yet. Create one to get started!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`task-card ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  {isOverdue(task.dueDate, task.status) && (
                    <span className="overdue-badge">⚠️ Overdue</span>
                  )}
                </div>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className={`badge ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`badge ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                {task.assignedTo && (
                  <p className="assigned">
                    👤 Assigned to: {task.assignedTo.name}
                  </p>
                )}
                {task.dueDate && (
                  <p className="due-date">
                    📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
                <div className="form-group">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}>
                    <option value="todo">Todo</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="btn-danger">
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTasks;