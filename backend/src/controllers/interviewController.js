const Interview = require('../models/Interview');
const aiService = require('../services/aiService');
const { validateInterviewData } = require('../utils/validation');
const logger = require('../utils/logger');

// Create a new interview
exports.createInterview = async (req, res) => {
  try {
    const { error } = validateInterviewData(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const interviewData = {
      ...req.body,
      userId: req.user?.id,
      status: 'created'
    };

    // Generate questions based on the interview configuration
    const questions = await aiService.generateQuestions({
      role: interviewData.role,
      experience: interviewData.experience,
      difficulty: interviewData.difficulty,
      focusAreas: interviewData.focusAreas,
      duration: interviewData.duration
    });

    interviewData.questions = questions;

    const interview = new Interview(interviewData);
    await interview.save();

    logger.info(`Interview created: ${interview._id} for ${interview.candidateName}`);

    res.status(201).json({
      id: interview._id,
      message: 'Interview created successfully',
      questionsCount: questions.length
    });

  } catch (error) {
    logger.error('Error creating interview:', error);
    res.status(500).json({ error: 'Failed to create interview' });
  }
};

// Get interview details
exports.getInterview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Start the interview if not already started
    if (interview.status === 'created') {
      interview.status = 'in-progress';
      interview.startTime = new Date();
      await interview.save();
    }

    res.json({
      id: interview._id,
      candidateName: interview.candidateName,
      role: interview.role,
      duration: interview.duration,
      questions: interview.questions,
      status: interview.status,
      currentQuestion: interview.answers.length
    });

  } catch (error) {
    logger.error('Error getting interview:', error);
    res.status(500).json({ error: 'Failed to get interview' });
  }
};

// Submit an answer
exports.submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answerData = req.body;

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (interview.status !== 'in-progress') {
      return res.status(400).json({ error: 'Interview is not in progress' });
    }

    // Analyze the answer using AI
    try {
      const analysis = await aiService.analyzeAnswer(
        answerData.question,
        answerData.answer,
        {
          role: interview.role,
          difficulty: interview.difficulty,
          category: interview.questions[answerData.questionIndex]?.category
        }
      );

      answerData.score = analysis.score;
      answerData.feedback = analysis.feedback;
    } catch (aiError) {
      logger.warn('AI analysis failed, using fallback scoring:', aiError.message);
      // Fallback scoring based on answer length and confidence
      answerData.score = Math.min(
        Math.round((answerData.answer.length / 10) + (answerData.confidence * 50)),
        100
      );
    }

    interview.answers.push(answerData);
    await interview.save();

    logger.info(`Answer submitted for interview ${id}, question ${answerData.questionIndex}`);

    res.json({
      message: 'Answer submitted successfully',
      score: answerData.score,
      feedback: answerData.feedback
    });

  } catch (error) {
    logger.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
};

// Finish interview
exports.finishInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Update interview with any remaining answers
    if (answers && answers.length > 0) {
      for (const answer of answers) {
        if (!interview.answers.find(a => a.questionIndex === answer.questionIndex)) {
          interview.answers.push(answer);
        }
      }
    }

    interview.status = 'completed';
    interview.endTime = new Date();

    // Calculate scores and generate feedback
    interview.calculateScores();
    interview.generateFeedback();

    await interview.save();

    // Update user stats if user is logged in
    if (req.user) {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);
      if (user) {
        const duration = Math.round((interview.endTime - interview.startTime) / (1000 * 60)); // minutes
        user.updateStats(interview.overallScore, duration);
        await user.save();
      }
    }

    logger.info(`Interview completed: ${id} with score ${interview.overallScore}`);

    res.json({
      message: 'Interview completed successfully',
      interviewId: interview._id,
      overallScore: interview.overallScore
    });

  } catch (error) {
    logger.error('Error finishing interview:', error);
    res.status(500).json({ error: 'Failed to finish interview' });
  }
};

// Get interview results
exports.getResults = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (interview.status !== 'completed') {
      return res.status(400).json({ error: 'Interview not completed yet' });
    }

    const duration = interview.endTime - interview.startTime;

    res.json({
      candidateName: interview.candidateName,
      role: interview.role,
      overallScore: interview.overallScore,
      communicationScore: interview.communicationScore,
      technicalScore: interview.technicalScore,
      behavioralScore: interview.behavioralScore,
      duration: Math.round(duration / 1000), // seconds
      questionsAnswered: interview.answers.length,
      totalQuestions: interview.questions.length,
      summary: interview.feedback.summary,
      strengths: interview.feedback.strengths,
      improvements: interview.feedback.improvements,
      answers: interview.answers.map(answer => ({
        question: answer.question,
        answer: answer.answer,
        score: answer.score,
        feedback: answer.feedback
      })),
      completedAt: interview.endTime
    });

  } catch (error) {
    logger.error('Error getting results:', error);
    res.status(500).json({ error: 'Failed to get results' });
  }
};

// Get user's interview history
exports.getUserInterviews = async (req, res) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = userId ? { userId } : {};
    
    const interviews = await Interview.find(query)
      .select('candidateName role duration overallScore status createdAt endTime')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Interview.countDocuments(query);

    res.json({
      interviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalInterviews: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    logger.error('Error getting user interviews:', error);
    res.status(500).json({ error: 'Failed to get interviews' });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (userId) {
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (user) {
        return res.json(user.stats);
      }
    }

    // Fallback: calculate stats from interviews
    const query = userId ? { userId } : {};
    const interviews = await Interview.find({ ...query, status: 'completed' });

    if (interviews.length === 0) {
      return res.json({
        totalInterviews: 0,
        averageScore: 0,
        totalTime: 0,
        improvementTrend: 0
      });
    }

    const totalScore = interviews.reduce((sum, interview) => sum + (interview.overallScore || 0), 0);
    const averageScore = Math.round(totalScore / interviews.length);
    
    const totalTime = interviews.reduce((sum, interview) => {
      if (interview.endTime && interview.startTime) {
        return sum + Math.round((interview.endTime - interview.startTime) / (1000 * 60));
      }
      return sum;
    }, 0);

    // Simple improvement trend calculation
    const recentInterviews = interviews.slice(-5);
    const recentAverage = recentInterviews.length > 0 
      ? Math.round(recentInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / recentInterviews.length)
      : 0;
    
    const improvementTrend = averageScore > 0 
      ? Math.round(((recentAverage - averageScore) / averageScore) * 100)
      : 0;

    res.json({
      totalInterviews: interviews.length,
      averageScore,
      totalTime,
      improvementTrend
    });

  } catch (error) {
    logger.error('Error getting user stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};
