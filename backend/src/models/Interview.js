const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'behavioral', 'situational', 'general', 'system-design']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  expectedAnswer: {
    type: String
  },
  tags: [{
    type: String
  }],
  timeLimit: {
    type: Number, // in seconds
    default: 300 // 5 minutes
  }
});

const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String
  }
});

const interviewSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    enum: ['0-1', '2-4', '5-7', '8-12', '12+']
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 120 // in minutes
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  focusAreas: [{
    type: String,
    enum: [
      'Technical Skills',
      'Problem Solving',
      'System Design',
      'Behavioral Questions',
      'Communication',
      'Leadership',
      'Project Management',
      'Algorithms & Data Structures'
    ]
  }],
  questions: [questionSchema],
  answers: [answerSchema],
  status: {
    type: String,
    enum: ['created', 'in-progress', 'completed', 'cancelled'],
    default: 'created'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  communicationScore: {
    type: Number,
    min: 0,
    max: 100
  },
  technicalScore: {
    type: Number,
    min: 0,
    max: 100
  },
  behavioralScore: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    summary: String,
    strengths: [String],
    improvements: [String],
    detailedFeedback: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
interviewSchema.index({ candidateName: 1, createdAt: -1 });
interviewSchema.index({ role: 1, createdAt: -1 });
interviewSchema.index({ status: 1, createdAt: -1 });
interviewSchema.index({ userId: 1, createdAt: -1 });

// Virtual for total questions count
interviewSchema.virtual('totalQuestions').get(function() {
  return this.questions.length;
});

// Virtual for answered questions count
interviewSchema.virtual('questionsAnswered').get(function() {
  return this.answers.length;
});

// Virtual for completion percentage
interviewSchema.virtual('completionPercentage').get(function() {
  if (this.questions.length === 0) return 0;
  return Math.round((this.answers.length / this.questions.length) * 100);
});

// Method to calculate scores
interviewSchema.methods.calculateScores = function() {
  if (this.answers.length === 0) return;

  const validAnswers = this.answers.filter(answer => answer.score !== undefined);
  
  if (validAnswers.length === 0) return;

  // Calculate overall score
  const totalScore = validAnswers.reduce((sum, answer) => sum + answer.score, 0);
  this.overallScore = Math.round(totalScore / validAnswers.length);

  // Calculate category-specific scores
  const technicalAnswers = validAnswers.filter(answer => 
    this.questions.find(q => q.text === answer.question)?.category === 'technical'
  );
  
  const behavioralAnswers = validAnswers.filter(answer => 
    this.questions.find(q => q.text === answer.question)?.category === 'behavioral'
  );

  if (technicalAnswers.length > 0) {
    const techScore = technicalAnswers.reduce((sum, answer) => sum + answer.score, 0);
    this.technicalScore = Math.round(techScore / technicalAnswers.length);
  }

  if (behavioralAnswers.length > 0) {
    const behavScore = behavioralAnswers.reduce((sum, answer) => sum + answer.score, 0);
    this.behavioralScore = Math.round(behavScore / behavioralAnswers.length);
  }

  // Communication score based on answer length and confidence
  const avgConfidence = validAnswers.reduce((sum, answer) => sum + (answer.confidence || 0), 0) / validAnswers.length;
  const avgAnswerLength = validAnswers.reduce((sum, answer) => sum + answer.answer.length, 0) / validAnswers.length;
  
  // Simple heuristic for communication score
  this.communicationScore = Math.round((avgConfidence * 50) + Math.min(avgAnswerLength / 10, 50));
};

// Method to generate feedback
interviewSchema.methods.generateFeedback = function() {
  const feedback = {
    summary: '',
    strengths: [],
    improvements: []
  };

  if (this.overallScore >= 85) {
    feedback.summary = 'Excellent performance! You demonstrated strong knowledge and communication skills throughout the interview.';
    feedback.strengths.push('Comprehensive and well-structured answers');
    feedback.strengths.push('Strong technical knowledge');
    feedback.strengths.push('Clear communication');
  } else if (this.overallScore >= 70) {
    feedback.summary = 'Good performance with room for improvement. You showed solid understanding of the concepts.';
    feedback.strengths.push('Good foundational knowledge');
    feedback.strengths.push('Adequate communication skills');
    feedback.improvements.push('Provide more detailed examples');
    feedback.improvements.push('Practice explaining complex concepts');
  } else if (this.overallScore >= 50) {
    feedback.summary = 'Average performance. Focus on strengthening your knowledge and practice more.';
    feedback.improvements.push('Study core concepts more thoroughly');
    feedback.improvements.push('Practice articulating your thoughts clearly');
    feedback.improvements.push('Work on providing specific examples');
  } else {
    feedback.summary = 'Below average performance. Significant improvement needed in multiple areas.';
    feedback.improvements.push('Review fundamental concepts');
    feedback.improvements.push('Practice mock interviews regularly');
    feedback.improvements.push('Work on communication and confidence');
  }

  // Add role-specific feedback
  if (this.role.toLowerCase().includes('engineer') || this.role.toLowerCase().includes('developer')) {
    if (this.technicalScore < 70) {
      feedback.improvements.push('Strengthen technical problem-solving skills');
      feedback.improvements.push('Practice coding challenges regularly');
    }
  }

  if (this.communicationScore < 70) {
    feedback.improvements.push('Work on speaking more clearly and confidently');
    feedback.improvements.push('Practice explaining technical concepts to non-technical audiences');
  }

  this.feedback = feedback;
};

module.exports = mongoose.model('Interview', interviewSchema);
