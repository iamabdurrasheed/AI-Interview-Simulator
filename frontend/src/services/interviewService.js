import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const interviewService = {
  // Create a new interview session
  async createInterview(interviewData) {
    try {
      const response = await api.post('/interviews', interviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create interview');
    }
  },

  // Get interview details
  async getInterview(interviewId) {
    try {
      const response = await api.get(`/interviews/${interviewId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get interview');
    }
  },

  // Submit an answer
  async submitAnswer(interviewId, answerData) {
    try {
      const response = await api.post(`/interviews/${interviewId}/answers`, answerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit answer');
    }
  },

  // Finish interview and get results
  async finishInterview(interviewId, answers) {
    try {
      const response = await api.post(`/interviews/${interviewId}/finish`, { answers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to finish interview');
    }
  },

  // Get interview results
  async getResults(interviewId) {
    try {
      const response = await api.get(`/interviews/${interviewId}/results`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get results');
    }
  },

  // Get user's interview history
  async getUserInterviews() {
    try {
      const response = await api.get('/interviews/user/history');
      return response.data;
    } catch (error) {
      console.error('Failed to get user interviews:', error);
      // Return mock data for now
      return [
        {
          id: '1',
          role: 'Frontend Developer',
          duration: 30,
          overallScore: 85,
          status: 'completed',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          role: 'Full Stack Developer',
          duration: 45,
          overallScore: 78,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    }
  },

  // Get user statistics
  async getUserStats() {
    try {
      const response = await api.get('/interviews/user/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      // Return mock data for now
      return {
        totalInterviews: 5,
        averageScore: 82,
        totalTime: 150,
        improvementTrend: 12
      };
    }
  },

  // Generate questions for interview
  async generateQuestions(interviewConfig) {
    try {
      const response = await api.post('/interviews/generate-questions', interviewConfig);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate questions');
    }
  },

  // Analyze answer with AI
  async analyzeAnswer(questionId, answer) {
    try {
      const response = await api.post('/interviews/analyze-answer', {
        questionId,
        answer
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to analyze answer');
    }
  }
};
