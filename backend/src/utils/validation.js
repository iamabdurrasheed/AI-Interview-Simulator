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

// Validation function
const validateInterviewData = (data) => {
  return interviewSchema.validate(data);
};

module.exports = {
  validateInterviewData,
  interviewSchema
};
