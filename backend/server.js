const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock data storage (since we don't have MongoDB running)
let interviews = [];
let users = [];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Interview Simulator API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      interviews: '/api/interviews'
    }
  });
});

// Mock interview endpoints
app.post('/api/interviews', (req, res) => {
  try {
    const interviewData = req.body;
    
    // Generate mock questions
    const questions = generateMockQuestions(interviewData);
    
    const interview = {
      id: Date.now().toString(),
      ...interviewData,
      questions,
      answers: [],
      status: 'created',
      createdAt: new Date().toISOString()
    };
    
    interviews.push(interview);
    
    res.status(201).json({
      id: interview.id,
      message: 'Interview created successfully',
      questionsCount: questions.length
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ error: 'Failed to create interview' });
  }
});

app.get('/api/interviews/:id', (req, res) => {
  try {
    const interview = interviews.find(i => i.id === req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    res.json({
      id: interview.id,
      candidateName: interview.candidateName,
      role: interview.role,
      duration: interview.duration,
      questions: interview.questions,
      status: interview.status,
      currentQuestion: interview.answers.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get interview' });
  }
});

app.post('/api/interviews/:id/answers', (req, res) => {
  try {
    const interview = interviews.find(i => i.id === req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    const answerData = req.body;
    // Simple scoring
    answerData.score = Math.min(Math.round((answerData.answer.length / 10) + (answerData.confidence * 50)), 100);
    answerData.feedback = answerData.score >= 70 ? 'Good answer!' : 'Could be improved with more details.';
    
    interview.answers.push(answerData);
    
    res.json({
      message: 'Answer submitted successfully',
      score: answerData.score,
      feedback: answerData.feedback
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

app.post('/api/interviews/:id/finish', (req, res) => {
  try {
    const interview = interviews.find(i => i.id === req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    interview.status = 'completed';
    interview.endTime = new Date().toISOString();
    
    // Calculate scores
    const scores = interview.answers.map(a => a.score || 0);
    interview.overallScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    interview.communicationScore = interview.overallScore;
    interview.technicalScore = interview.overallScore;
    
    res.json({
      message: 'Interview completed successfully',
      interviewId: interview.id,
      overallScore: interview.overallScore
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to finish interview' });
  }
});

app.get('/api/interviews/:id/results', (req, res) => {
  try {
    const interview = interviews.find(i => i.id === req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    res.json({
      candidateName: interview.candidateName,
      role: interview.role,
      overallScore: interview.overallScore || 75,
      communicationScore: interview.communicationScore || 80,
      technicalScore: interview.technicalScore || 70,
      behavioralScore: 85,
      duration: 1800, // 30 minutes in seconds
      questionsAnswered: interview.answers.length,
      totalQuestions: interview.questions.length,
      summary: 'Great performance! You demonstrated good knowledge and communication skills.',
      strengths: ['Clear communication', 'Good technical understanding', 'Well-structured answers'],
      improvements: ['Provide more specific examples', 'Practice advanced concepts'],
      answers: interview.answers.map(answer => ({
        question: answer.question,
        answer: answer.answer,
        score: answer.score,
        feedback: answer.feedback
      })),
      completedAt: interview.endTime
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get results' });
  }
});

// Mock user stats
app.get('/api/interviews/user/stats', (req, res) => {
  res.json({
    totalInterviews: interviews.length,
    averageScore: 82,
    totalTime: 150,
    improvementTrend: 12
  });
});

app.get('/api/interviews/user/history', (req, res) => {
  res.json(interviews.map(i => ({
    id: i.id,
    candidateName: i.candidateName,
    role: i.role,
    duration: i.duration,
    overallScore: i.overallScore || 75,
    status: i.status,
    createdAt: i.createdAt
  })));
});

// Generate mock questions
function generateMockQuestions(config) {
  const questions = [
    { text: "Tell me about yourself and your background.", category: "general", difficulty: config.difficulty, timeLimit: 180 },
    { text: `What interests you about the ${config.role} position?`, category: "general", difficulty: config.difficulty, timeLimit: 180 },
    { text: "Describe a challenging project you've worked on.", category: "behavioral", difficulty: config.difficulty, timeLimit: 300 },
    { text: "How do you handle tight deadlines and pressure?", category: "behavioral", difficulty: config.difficulty, timeLimit: 240 },
    { text: "What are your greatest strengths and areas for improvement?", category: "behavioral", difficulty: config.difficulty, timeLimit: 240 },
  ];
  
  if (config.role.toLowerCase().includes('engineer') || config.role.toLowerCase().includes('developer')) {
    questions.push(
      { text: "Explain the difference between let, const, and var in JavaScript.", category: "technical", difficulty: config.difficulty, timeLimit: 300 },
      { text: "How would you optimize a slow-loading web page?", category: "technical", difficulty: config.difficulty, timeLimit: 360 },
      { text: "Describe your experience with version control systems.", category: "technical", difficulty: config.difficulty, timeLimit: 240 }
    );
  }
  
  return questions.slice(0, Math.floor(config.duration / 5)); // ~5 minutes per question
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend URL: http://localhost:3000`);
  console.log(`💾 Running in demo mode (data stored in memory)`);
});
