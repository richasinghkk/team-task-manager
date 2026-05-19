const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT} ✅`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });