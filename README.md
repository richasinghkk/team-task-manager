# 📋 Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control (Admin/Member).

## 🌐 Live Demo
👉 https://task-manager-frontend.onrender.com

## 🎥 Demo Video
👉 [Click to Watch Demo Video](your-video-link-here)

## 🚀 Key Features

- 🔐 **Authentication** - Signup/Login with JWT tokens
- 👥 **Project & Team Management** - Create projects, add team members
- 📋 **Task Management** - Create, assign, and track tasks
- 📊 **Dashboard** - Real-time stats (total, completed, overdue tasks)
- 🔒 **Role-Based Access Control** - Admin and Member roles
- ⚠️ **Overdue Detection** - Automatic overdue task highlighting

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- React Toastify
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB Atlas (NoSQL Database)
- JWT Authentication
- bcryptjs

### Deployment
- Frontend → Render.com
- Backend → Render.com
- Database → MongoDB Atlas

## ⚙️ Local Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### 1. Clone the repo
```bash
git clone https://github.com/richasinghkk/team-task-manager.git
cd team-task-manager
```

### 2. Backend Setup
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

### 3. Frontend Setup
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
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   └── server.js
│
└── frontend/
└── src/
├── context/
│   └── AuthContext.js
├── pages/
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   └── ProjectTasks.js
└── utils/
└── api.js

## 👤 Role-Based Access Control

| Feature | Admin | Member |
|---------|-------|--------|
| Create Project | ✅ | ❌ |
| Delete Project | ✅ | ❌ |
| Add Members | ✅ | ❌ |
| Create Task | ✅ | ❌ |
| Assign Task | ✅ | ❌ |
| Delete Task | ✅ | ❌ |
| Update Task Status | ✅ | ✅ |
| View Projects | ✅ | ✅ |
| View Tasks | ✅ | ✅ |

## 📡 REST API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get profile |
| GET | `/api/auth/user-by-email` | Get user by email |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get single project |
| PUT | `/api/projects/:id/addmember` | Add member |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:projectId` | Get project tasks |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/overdue` | Get overdue tasks |

## 🔗 Links

- **Live App:** https://task-manager-frontend.onrender.com
- **GitHub Repo:** https://github.com/richasinghkk/team-task-manager
- **Backend API:** https://team-task-manager-kmic.onrender.com
