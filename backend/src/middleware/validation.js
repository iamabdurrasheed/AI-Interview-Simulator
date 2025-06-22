const Joi = require('joi');

// Interview validation schema
const interviewSchema = Joi.object({
  candidateName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Candidate name is required',
      'string.min': 'Candidate name must be at least 2 characters long',
      'string.max': 'Candidate name must not exceed 100 characters'
    }),

  role: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Role is required',
      'string.min': 'Role must be at least 2 characters long'
    }),

  experience: Joi.string()
    .valid('0-1', '2-4', '5-7', '8-12', '12+')
    .required()
    .messages({
      'any.only': 'Experience must be one of: 0-1, 2-4, 5-7, 8-12, 12+'
    }),

  duration: Joi.number()
    .integer()
    .min(15)
    .max(120)
    .required()
    .messages({
      'number.min': 'Duration must be at least 15 minutes',
      'number.max': 'Duration must not exceed 120 minutes'
    }),

  difficulty: Joi.string()
    .valid('beginner', 'intermediate', 'advanced', 'expert')
    .required()
    .messages({
      'any.only': 'Difficulty must be one of: beginner, intermediate, advanced, expert'
    }),

  focusAreas: Joi.array()
    .items(Joi.string().valid(
      'Technical Skills',
      'Problem Solving',
      'System Design',
      'Behavioral Questions',
      'Communication',
      'Leadership',
      'Project Management',
      'Algorithms & Data Structures'
    ))
    .optional()
});

// User registration validation schema
const userRegistrationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 50 characters'
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),

  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password must not exceed 128 characters',
      'string.empty': 'Password is required'
    })
});

// User login validation schema
const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// Answer validation schema
const answerSchema = Joi.object({
  questionIndex: Joi.number()
    .integer()
    .min(0)
    .required(),

  question: Joi.string()
    .required(),

  answer: Joi.string()
    .trim()
    .min(1)
    .max(10000)
    .required()
    .messages({
      'string.empty': 'Answer cannot be empty',
      'string.max': 'Answer is too long (maximum 10,000 characters)'
    }),

  confidence: Joi.number()
    .min(0)
    .max(1)
    .optional(),

  timestamp: Joi.date()
    .optional(),

  duration: Joi.number()
    .min(0)
    .optional()
});

// Validation middleware functions
const validateInterview = (req, res, next) => {
  const { error } = interviewSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

const validateUser = (req, res, next) => {
  const { error } = userRegistrationSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

const validateAnswer = (req, res, next) => {
  const { error } = answerSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

// Utility function for validation
const validateInterviewData = (data) => {
  return interviewSchema.validate(data);
};

module.exports = {
  validateInterview,
  validateUser,
  validateLogin,
  validateAnswer,
  validateInterviewData,
  interviewSchema,
  userRegistrationSchema,
  userLoginSchema,
  answerSchema
};
