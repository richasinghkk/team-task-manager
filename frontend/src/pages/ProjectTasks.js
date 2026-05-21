import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus, FiTrash2, FiSearch, FiArrowLeft, FiUserPlus } from 'react-icons/fi';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const columns = [
  { id: 'todo', title: '📝 Todo', color: '#6366f1' },
  { id: 'inprogress', title: '⚡ In Progress', color: '#f59e0b' },
  { id: 'completed', title: '✅ Completed', color: '#10b981' }
];

const ProjectTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
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

  useEffect(() => {
    let filtered = [...tasks];
    if (search) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterPriority !== 'all') {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }
    setFilteredTasks(filtered);
  }, [search, filterPriority, tasks]);

  const fetchProject = async () => {
    try {
      const response = await API.get(`/projects/${id}`);
      if (response && response.data) {
        setProject(response.data);
        setMembers(Array.isArray(response.data.members) ? response.data.members : []);
      }
    } catch (error) {
      console.log('Project fetch error:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await API.get(`/tasks/${id}`);
      if (response && response.data) {
        const taskList = Array.isArray(response.data) ? response.data : [];
        setTasks(taskList);
        setFilteredTasks(taskList);
      }
    } catch (error) {
      console.log('Tasks fetch error:', error);
      setTasks([]);
      setFilteredTasks([]);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    try {
      await API.put(`/tasks/${draggableId}`, { status: newStatus });
      toast.success('Task moved!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to move task');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', { ...newTask, project: id });
      toast.success('Task created!');
      setShowTaskForm(false);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });
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

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success('Task deleted!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(t => t.status === status);
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <span style={{fontSize: '24px'}}>📋</span>
          <h1>{project?.name || 'Project Tasks'}</h1>
        </div>
        <div className="nav-right">
          <div className="nav-user">
            <div className="nav-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{user?.name}</span>
            <span className="nav-role">{user?.role}</span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-logout">
            <FiArrowLeft /> Back
          </button>
        </div>
      </nav>

      <div className="dashboard-content">

        {/* Members Section */}
        <div className="members-section">
          <div className="dashboard-header">
            <h3>👥 Team Members ({members.length})</h3>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowMemberForm(!showMemberForm)}
                className="btn-secondary">
                <FiUserPlus /> Add Member
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
                <button type="submit" className="btn-primary" style={{width:'auto'}}>
                  <FiUserPlus /> Add Member
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Tasks Header */}
        <div className="dashboard-header">
          <h2>Tasks Board</h2>
          {user?.role === 'admin' && (
            <button onClick={() => setShowTaskForm(!showTaskForm)} className="btn-primary" style={{width:'auto'}}>
              <FiPlus /> New Task
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="search-filter-bar">
          <div className="search-wrapper">
            <span className="search-icon"><FiSearch /></span>
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="form-card">
            <h3>✨ Create New Task</h3>
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
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
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
              <button type="submit" className="btn-primary" style={{width:'auto'}}>
                <FiPlus /> Create Task
              </button>
            </form>
          </div>
        )}

        {/* Drag & Drop Task Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="tasks-container">
            {columns.map((column) => (
              <div key={column.id} className="task-column">
                <div className="task-column-header">
                  <h3 style={{color: column.color}}>{column.title}</h3>
                  <span className="task-count">
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: '200px',
                        background: snapshot.isDraggingOver ? '#f0f4ff' : 'transparent',
                        borderRadius: '8px',
                        padding: '4px',
                        transition: 'background 0.2s'
                      }}>
                      {getTasksByStatus(column.id).length === 0 ? (
                        <p style={{textAlign:'center', color:'#94a3b8', fontSize:'13px', padding:'20px'}}>
                          Drop tasks here
                        </p>
                      ) : (
                        getTasksByStatus(column.id).map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`task-card ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}
                                style={{
                                  ...provided.draggableProps.style,
                                  boxShadow: snapshot.isDragging ? '0 10px 30px rgba(0,0,0,0.2)' : ''
                                }}>
                                <div className="task-header">
                                  <h3>{task.title}</h3>
                                  {isOverdue(task.dueDate, task.status) && (
                                    <span className="overdue-badge">⚠️ Overdue</span>
                                  )}
                                </div>
                                {task.description && (
                                  <p className="task-description">{task.description}</p>
                                )}
                                <div className="task-meta">
                                  <span className={`badge priority-${task.priority}`}>
                                    {task.priority}
                                  </span>
                                </div>
                                {task.assignedTo && (
                                  <p className="assigned">
                                    👤 {task.assignedTo.name}
                                  </p>
                                )}
                                {task.dueDate && (
                                  <p className="due-date">
                                    📅 {new Date(task.dueDate).toLocaleDateString()}
                                  </p>
                                )}
                                {user?.role === 'admin' && (
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="btn-danger">
                                    <FiTrash2 /> Delete
                                  </button>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ProjectTasks;