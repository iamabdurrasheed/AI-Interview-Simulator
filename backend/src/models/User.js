const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    experience: String,
    currentRole: String,
    skills: [String],
    resumeUrl: String
  },
  preferences: {
    preferredDifficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    focusAreas: [String],
    notificationsEnabled: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    totalInterviews: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    bestScore: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0
    },
    improvementTrend: {
      type: Number,
      default: 0
    }
  },
  lastLoginAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Update user stats
userSchema.methods.updateStats = function(interviewScore, duration) {
  this.stats.totalInterviews += 1;
  this.stats.totalTimeSpent += duration;
  
  // Update average score
  const previousTotal = this.stats.averageScore * (this.stats.totalInterviews - 1);
  this.stats.averageScore = Math.round((previousTotal + interviewScore) / this.stats.totalInterviews);
  
  // Update best score
  if (interviewScore > this.stats.bestScore) {
    this.stats.bestScore = interviewScore;
  }
  
  // Calculate improvement trend (simplified)
  if (this.stats.totalInterviews > 1) {
    const recentAverage = interviewScore; // Could be made more sophisticated
    const overallAverage = this.stats.averageScore;
    this.stats.improvementTrend = Math.round(((recentAverage - overallAverage) / overallAverage) * 100);
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
