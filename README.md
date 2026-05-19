# 📋 Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

## 🌐 Live Demo
👉 https://scintillating-youthfulness-production-c112.up.railway.app

## 🚀 Features

- 🔐 **Authentication** - Signup/Login with JWT tokens
- 👥 **Team Management** - Create projects and add members
- 📋 **Task Management** - Create, assign, and track tasks
- 📊 **Dashboard** - View stats, status, and overdue tasks
- 🔒 **Role-Based Access** - Admin and Member roles

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router DOM
- Axios
- React Toastify

**Backend:**
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication
- bcryptjs

**Deployment:**
- Railway (Frontend + Backend)
- MongoDB Atlas (Database)

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret

Run backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure
team-task-manager/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── frontend/
├── public/
└── src/
├── components/
├── context/
├── pages/
└── utils/

## 👤 Role-Based Access

| Feature | Admin | Member |
|---------|-------|--------|
| Create Project | ✅ | ❌ |
| Delete Project | ✅ | ❌ |
| Create Task | ✅ | ❌ |
| Delete Task | ✅ | ❌ |
| Update Task Status | ✅ | ✅ |
| View Projects | ✅ | ✅ |
| View Tasks | ✅ | ✅ |

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id/addmember` - Add member
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:projectId` - Get project tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/overdue` - Get overdue tasks