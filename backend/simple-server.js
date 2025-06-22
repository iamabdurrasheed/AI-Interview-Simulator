console.log('Starting server...');

const express = require('express');
console.log('Express loaded');

const cors = require('cors');
console.log('CORS loaded');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Setting up middleware...');

// Basic middleware
app.use(cors());
app.use(express.json());

console.log('Setting up routes...');

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'AI Interview Simulator API is running'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Interview Simulator API',
    version: '1.0.0',
    status: 'Running'
  });
});

console.log('Starting server on port', PORT);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API Base: http://localhost:${PORT}/`);
});
