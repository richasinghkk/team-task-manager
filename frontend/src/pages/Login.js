import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const { data } = await API.post('/auth/login', formData);
      login(data);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
        <h2>Welcome Back 👋</h2>
        <p>Sign in to your account to continue</p>
        <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{paddingLeft: '42px'}}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{marginTop: '8px'}}>
            {loading ? '⏳ Signing in...' : <><FiLogIn /> Sign In</>}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;