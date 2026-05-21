import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiUserPlus } from 'react-icons/fi';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'member'
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      login(data);
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <span style={{fontSize: '32px'}}>📋</span>
          <h1>TaskManager</h1>
        </div>
        <h2>Create Account 🚀</h2>
        <p>Join TaskManager and boost your productivity</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={{position: 'relative'}}>
              <FiUser style={{
                position: 'absolute', left: '14px',
                top: '50%', transform: 'translateY(-50%)',
                color: '#94a3b8', fontSize: '16px'
              }}/>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                style={{paddingLeft: '42px'}}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{position: 'relative'}}>
              <FiMail style={{
                position: 'absolute', left: '14px',
                top: '50%', transform: 'translateY(-50%)',
                color: '#94a3b8', fontSize: '16px'
              }}/>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={{paddingLeft: '42px'}}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{position: 'relative'}}>
              <FiLock style={{
                position: 'absolute', left: '14px',
                top: '50%', transform: 'translateY(-50%)',
                color: '#94a3b8', fontSize: '16px'
              }}/>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                style={{paddingLeft: '42px'}}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Select Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="member">👤 Member</option>
              <option value="admin">👑 Admin</option>
            </select>
          </div>

          {/* Role Info */}
          <div style={{
            background: formData.role === 'admin' ? '#eff6ff' : '#f0fdf4',
            border: `1px solid ${formData.role === 'admin' ? '#bfdbfe' : '#bbf7d0'}`,
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '13px',
            color: formData.role === 'admin' ? '#1d4ed8' : '#15803d'
          }}>
            {formData.role === 'admin'
              ? '👑 Admin: Can create/delete projects and tasks, add members'
              : '👤 Member: Can view projects and update task status'}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}>
            {loading ? '⏳ Creating account...' : <><FiUserPlus /> Create Account</>}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;