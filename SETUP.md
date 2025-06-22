# 🚀 AI Interview Simulator - Setup Guide

This guide will help you set up the AI Interview Simulator project on your local machine for development and collaboration.

## 📋 Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd AI-Interview-Simulator
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install root dependencies (for running both servers concurrently)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root directory
cd ..
```

### 3. Environment Setup

#### Backend Environment
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration (Optional - app works without it)
   MONGODB_URI=mongodb://localhost:27017/ai-interview-simulator
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # OpenAI Configuration (Optional - for AI features)
   OPENAI_API_KEY=your-openai-api-key-here
   ```

#### Frontend Environment
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_APP_NAME=AI Interview Simulator
   ```

### 4. Database Setup (Optional)

The application works in **demo mode** without a database. If you want to use MongoDB:

#### Option A: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env`

#### Option B: Local MongoDB
1. Install MongoDB locally - [Download here](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services start mongodb/brew/mongodb-community
   # or
   sudo systemctl start mongod
   ```
3. Update `MONGODB_URI` in `backend/.env` to `mongodb://localhost:27017/ai-interview-simulator`

## 🚀 Running the Application

### Development Mode (Recommended)

From the root directory, run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- **Backend server** on http://localhost:5000
- **Frontend application** on http://localhost:3000

### Running Separately

If you prefer to run servers separately:

#### Backend Only
```bash
cd backend
npm run dev
```

#### Frontend Only
```bash
cd frontend
npm start
```

## 🌐 Accessing the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 📁 Project Structure

```
AI-Interview-Simulator/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   └── ...
│   └── package.json
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   └── package.json
├── shared/                   # Shared constants/utilities
├── README.md                 # Project documentation
├── SETUP.md                  # This setup guide
└── package.json              # Root package.json
```

## 🛠️ Development Commands

### Root Directory Commands
```bash
npm run dev          # Start both frontend and backend
npm run client       # Start only frontend
npm run server       # Start only backend
npm run build        # Build frontend for production
```

### Backend Commands
```bash
cd backend
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server
npm run test         # Run tests
```

### Frontend Commands
```bash
cd frontend
npm start            # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run eject        # Eject from Create React App (careful!)
```

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
If you get a port conflict error:
```bash
# Kill processes on port 3000 or 5000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

#### Module Not Found Errors
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Do this for both frontend and backend folders
```

#### MongoDB Connection Issues
- Make sure MongoDB is running
- Check your connection string in `.env`
- The app works without MongoDB in demo mode

#### CORS Issues
- Make sure backend is running on port 5000
- Check `proxy` setting in `frontend/package.json`

### Getting Help

1. Check the [README.md](./README.md) for project overview
2. Look at existing issues in the repository
3. Create a new issue with detailed error information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 Notes

- The application runs in **demo mode** by default (data stored in memory)
- AI features require OpenAI API key (optional)
- All API endpoints work without authentication in demo mode
- MongoDB is optional - the app works fully without it

## ✅ Verification

After setup, verify everything works:

1. ✅ Both servers start without errors
2. ✅ Frontend loads at http://localhost:3000
3. ✅ Backend responds at http://localhost:5000/health
4. ✅ You can create a new interview
5. ✅ Interview session loads properly
6. ✅ Results page displays after interview

---

**Happy coding! 🎉**

If you encounter any issues, please create an issue in the repository with detailed information about your system and the error messages.
