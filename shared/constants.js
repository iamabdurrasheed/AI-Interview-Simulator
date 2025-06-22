// Application Constants
export const APP_CONFIG = {
  NAME: 'AI Interview Simulator',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered mock interview platform to help job seekers practice and improve their interview skills'
};

// Interview Configuration
export const INTERVIEW_CONFIG = {
  DURATIONS: [
    { value: 15, label: '15 minutes (Quick Practice)' },
    { value: 30, label: '30 minutes (Standard)' },
    { value: 45, label: '45 minutes (Comprehensive)' },
    { value: 60, label: '60 minutes (Full Interview)' }
  ],

  DIFFICULTIES: [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ],

  EXPERIENCE_LEVELS: [
    { value: '0-1', label: '0-1 years (Entry Level)' },
    { value: '2-4', label: '2-4 years (Junior)' },
    { value: '5-7', label: '5-7 years (Mid-Level)' },
    { value: '8-12', label: '8-12 years (Senior)' },
    { value: '12+', label: '12+ years (Lead/Principal)' }
  ],

  ROLES: [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Data Analyst',
    'Product Manager',
    'DevOps Engineer',
    'UI/UX Designer',
    'QA Engineer',
    'System Administrator',
    'Business Analyst',
    'Mobile Developer',
    'Machine Learning Engineer',
    'Cybersecurity Specialist'
  ],

  FOCUS_AREAS: [
    'Technical Skills',
    'Problem Solving',
    'System Design',
    'Behavioral Questions',
    'Communication',
    'Leadership',
    'Project Management',
    'Algorithms & Data Structures',
    'Database Design',
    'API Development',
    'Cloud Technologies',
    'Testing Strategies'
  ],

  QUESTION_CATEGORIES: [
    'technical',
    'behavioral',
    'situational',
    'general',
    'system-design'
  ],

  STATUS: [
    'created',
    'in-progress',
    'completed',
    'cancelled'
  ]
};

// Scoring Configuration
export const SCORING_CONFIG = {
  SCORE_RANGES: {
    EXCELLENT: { min: 85, max: 100, label: 'Excellent', color: '#28a745' },
    GOOD: { min: 70, max: 84, label: 'Good', color: '#17a2b8' },
    AVERAGE: { min: 55, max: 69, label: 'Average', color: '#ffc107' },
    BELOW_AVERAGE: { min: 40, max: 54, label: 'Below Average', color: '#fd7e14' },
    POOR: { min: 0, max: 39, label: 'Needs Improvement', color: '#dc3545' }
  },

  FEEDBACK_THRESHOLDS: {
    EXCELLENT_THRESHOLD: 85,
    GOOD_THRESHOLD: 70,
    AVERAGE_THRESHOLD: 55,
    POOR_THRESHOLD: 40
  }
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000, // 30 seconds
  
  ENDPOINTS: {
    INTERVIEWS: '/interviews',
    AUTH: '/auth',
    USERS: '/users'
  }
};

// Speech Recognition Configuration
export const SPEECH_CONFIG = {
  LANGUAGE: 'en-US',
  CONTINUOUS: true,
  INTERIM_RESULTS: true,
  MAX_ALTERNATIVES: 1,
  
  // Time limits in seconds
  MAX_RECORDING_TIME: 600, // 10 minutes
  SILENCE_TIMEOUT: 5, // 5 seconds of silence before stopping
  
  // Confidence thresholds
  MIN_CONFIDENCE: 0.7,
  HIGH_CONFIDENCE: 0.9
};

// UI Configuration
export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#667eea',
    SECONDARY: '#764ba2',
    SUCCESS: '#28a745',
    WARNING: '#ffc107',
    DANGER: '#dc3545',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40'
  },

  BREAKPOINTS: {
    XS: '0px',
    SM: '576px',
    MD: '768px',
    LG: '992px',
    XL: '1200px',
    XXL: '1400px'
  },

  ANIMATION_DURATIONS: {
    FAST: '0.15s',
    NORMAL: '0.3s',
    SLOW: '0.5s'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please log in again.',
  AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
  NOT_FOUND_ERROR: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  SPEECH_NOT_SUPPORTED: 'Speech recognition is not supported in your browser.',
  MICROPHONE_ERROR: 'Microphone access denied or not available.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  INTERVIEW_CREATED: 'Interview session created successfully!',
  INTERVIEW_COMPLETED: 'Interview completed successfully!',
  ANSWER_SUBMITTED: 'Answer submitted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  REGISTRATION_SUCCESS: 'Registration successful!'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'ai_interview_token',
  USER_DATA: 'ai_interview_user',
  INTERVIEW_DRAFT: 'ai_interview_draft',
  SETTINGS: 'ai_interview_settings',
  THEME: 'ai_interview_theme'
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  INTERVIEW_STARTED: 'interview_started',
  INTERVIEW_COMPLETED: 'interview_completed',
  QUESTION_ANSWERED: 'question_answered',
  SPEECH_RECOGNITION_USED: 'speech_recognition_used',
  PROFILE_UPDATED: 'profile_updated',
  LOGIN: 'user_login',
  REGISTER: 'user_register'
};

// Feature Flags
export const FEATURE_FLAGS = {
  SPEECH_RECOGNITION: true,
  AI_SCORING: true,
  USER_AUTHENTICATION: true,
  ANALYTICS: false,
  DARK_MODE: false,
  MOBILE_APP: false
};

// Default Values
export const DEFAULTS = {
  INTERVIEW_DURATION: 30,
  INTERVIEW_DIFFICULTY: 'intermediate',
  QUESTIONS_PER_INTERVIEW: 8,
  MAX_ANSWER_LENGTH: 10000,
  MIN_ANSWER_LENGTH: 10
};
