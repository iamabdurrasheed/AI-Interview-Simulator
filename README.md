# 🎯 AI Interview Simulator

An AI-powered interview practice platform built with the MERN stack. Get personalized feedback, practice with voice recognition, and improve your interview skills.

![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Express](https://img.shields.io/badge/Express-4.18+-orange)

## ✨ Features

- **🎤 Voice Recognition**: Practice interviews by speaking naturally
- **🤖 AI-Powered Questions**: Dynamic questions based on job role and experience
- **📊 Real-time Feedback**: Instant evaluation with detailed scoring
- **📈 Progress Tracking**: Monitor improvement across multiple sessions
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🔐 Secure**: JWT authentication and data protection

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Git
- Modern web browser with microphone

### Installation

```bash
# Clone and setup
git clone <your-repo-url>
cd AI-Interview-Simulator
npm install

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..

# Create environment files
echo "PORT=5000" > backend/.env
echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env

# Start the app
npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📁 Project Structure

```
AI-Interview-Simulator/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom hooks
│   │   └── services/      # API services
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic
└── shared/            # Shared utilities
```

## 🎯 How It Works

1. **Setup**: Choose job role, experience level, and interview type
2. **Interview**: AI asks relevant questions, you respond via voice/text
3. **Analysis**: Get instant feedback on communication, technical skills, confidence
4. **Progress**: Track improvement over multiple sessions

## 🛠️ Tech Stack

**Frontend**: React, React Router, Web Speech API, Axios  
**Backend**: Node.js, Express, MongoDB, JWT, bcrypt  
**AI**: OpenAI GPT for question generation and response analysis

## 📋 Available Scripts

```bash
npm run dev          # Start both frontend and backend
npm run client       # Frontend only
npm run server       # Backend only
npm run build        # Production build
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview-simulator
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

