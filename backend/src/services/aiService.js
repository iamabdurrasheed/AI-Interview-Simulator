const logger = require('../utils/logger');

// Mock AI service - replace with actual AI service integration
class AIService {
  constructor() {
    this.questionBank = {
      'Software Engineer': {
        technical: [
          'Explain the difference between let, const, and var in JavaScript.',
          'What is the time complexity of binary search?',
          'How would you implement a debounce function?',
          'Explain the concept of closures in JavaScript.',
          'What are the differences between SQL and NoSQL databases?',
          'How do you handle memory leaks in JavaScript applications?',
          'Explain the difference between synchronous and asynchronous programming.',
          'What is the purpose of indexing in databases?'
        ],
        behavioral: [
          'Tell me about a challenging project you worked on.',
          'How do you handle tight deadlines?',
          'Describe a time when you had to learn a new technology quickly.',
          'How do you approach debugging a complex issue?',
          'Tell me about a time when you disagreed with a team member.',
          'How do you stay updated with new technologies?',
          'Describe your experience working in an agile environment.',
          'How do you prioritize tasks when everything seems urgent?'
        ],
        'system-design': [
          'Design a URL shortening service like bit.ly.',
          'How would you design a chat application?',
          'Design a system to handle user authentication.',
          'How would you design a caching system?',
          'Design a file storage system like Dropbox.',
          'How would you design a notification system?'
        ]
      },
      'Frontend Developer': {
        technical: [
          'What is the virtual DOM and how does it work?',
          'Explain the difference between CSS Grid and Flexbox.',
          'How do you optimize web page performance?',
          'What are Web Components?',
          'Explain the concept of progressive web apps.',
          'How do you handle cross-browser compatibility?',
          'What is server-side rendering vs client-side rendering?',
          'Explain CSS specificity and how it works.'
        ],
        behavioral: [
          'How do you ensure your code is accessible?',
          'Describe your approach to responsive design.',
          'How do you handle browser compatibility issues?',
          'Tell me about a time you improved user experience.',
          'How do you collaborate with designers?',
          'Describe your testing approach for frontend code.',
          'How do you handle performance optimization?',
          'What\'s your process for code reviews?'
        ]
      },
      'Data Scientist': {
        technical: [
          'Explain the bias-variance tradeoff.',
          'What is overfitting and how do you prevent it?',
          'Difference between supervised and unsupervised learning.',
          'How do you handle missing data in a dataset?',
          'Explain the concept of feature engineering.',
          'What is cross-validation and why is it important?',
          'Explain different types of machine learning algorithms.',
          'How do you evaluate model performance?'
        ],
        behavioral: [
          'How do you communicate complex findings to non-technical stakeholders?',
          'Describe a challenging data problem you solved.',
          'How do you ensure data quality?',
          'Tell me about a time your analysis led to a business decision.',
          'How do you stay current with data science trends?',
          'Describe your approach to exploratory data analysis.',
          'How do you handle conflicting requirements from stakeholders?',
          'Tell me about a project where you had to work with messy data.'
        ]
      }
    };

    this.generalQuestions = {
      behavioral: [
        'Tell me about yourself.',
        'Why are you interested in this role?',
        'What are your strengths and weaknesses?',
        'Where do you see yourself in 5 years?',
        'Why are you leaving your current job?',
        'What motivates you?',
        'How do you handle stress?',
        'Describe your ideal work environment.'
      ],
      general: [
        'What interests you about our company?',
        'How do you handle criticism?',
        'What\'s your greatest professional achievement?',
        'How do you approach learning new skills?',
        'What kind of work environment do you thrive in?',
        'How do you handle conflicts at work?',
        'What questions do you have for us?'
      ]
    };
  }

  async generateQuestions(config) {
    try {
      const { role, experience, difficulty, focusAreas, duration } = config;
      
      // Calculate number of questions based on duration
      const questionsCount = Math.max(Math.floor(duration / 5), 3); // Roughly 5 minutes per question
      
      const questions = [];
      const roleQuestions = this.questionBank[role] || {};
      
      // Determine question distribution
      const distributions = {
        beginner: { technical: 0.3, behavioral: 0.5, general: 0.2 },
        intermediate: { technical: 0.5, behavioral: 0.3, general: 0.2 },
        advanced: { technical: 0.6, behavioral: 0.3, general: 0.1 },
        expert: { technical: 0.7, behavioral: 0.2, general: 0.1 }
      };

      const dist = distributions[difficulty] || distributions.intermediate;
      
      // Calculate questions per category
      const technicalCount = Math.floor(questionsCount * dist.technical);
      const behavioralCount = Math.floor(questionsCount * dist.behavioral);
      const generalCount = questionsCount - technicalCount - behavioralCount;

      // Add technical questions
      if (technicalCount > 0 && roleQuestions.technical) {
        const shuffled = this.shuffleArray([...roleQuestions.technical]);
        for (let i = 0; i < Math.min(technicalCount, shuffled.length); i++) {
          questions.push({
            text: shuffled[i],
            category: 'technical',
            difficulty: difficulty,
            timeLimit: 300 // 5 minutes
          });
        }
      }

      // Add system design questions for senior levels
      if ((difficulty === 'advanced' || difficulty === 'expert') && roleQuestions['system-design']) {
        const systemDesignCount = Math.floor(technicalCount * 0.3);
        const shuffled = this.shuffleArray([...roleQuestions['system-design']]);
        for (let i = 0; i < Math.min(systemDesignCount, shuffled.length); i++) {
          questions.push({
            text: shuffled[i],
            category: 'system-design',
            difficulty: difficulty,
            timeLimit: 600 // 10 minutes for system design
          });
        }
      }

      // Add behavioral questions
      if (behavioralCount > 0) {
        const behavioralPool = [
          ...(roleQuestions.behavioral || []),
          ...this.generalQuestions.behavioral
        ];
        const shuffled = this.shuffleArray(behavioralPool);
        for (let i = 0; i < Math.min(behavioralCount, shuffled.length); i++) {
          questions.push({
            text: shuffled[i],
            category: 'behavioral',
            difficulty: difficulty,
            timeLimit: 240 // 4 minutes
          });
        }
      }

      // Add general questions
      if (generalCount > 0) {
        const shuffled = this.shuffleArray([...this.generalQuestions.general]);
        for (let i = 0; i < Math.min(generalCount, shuffled.length); i++) {
          questions.push({
            text: shuffled[i],
            category: 'general',
            difficulty: difficulty,
            timeLimit: 180 // 3 minutes
          });
        }
      }

      // Shuffle final questions
      const finalQuestions = this.shuffleArray(questions);
      
      logger.info(`Generated ${finalQuestions.length} questions for ${role} interview`);
      
      return finalQuestions.slice(0, questionsCount);

    } catch (error) {
      logger.error('Error generating questions:', error);
      throw new Error('Failed to generate interview questions');
    }
  }

  async analyzeAnswer(question, answer, context = {}) {
    try {
      // Simple scoring algorithm - replace with actual AI analysis
      const { role, difficulty, category } = context;
      
      let score = 0;
      let feedback = '';
      
      // Basic scoring based on answer length and keywords
      const answerLength = answer.length;
      const wordCount = answer.split(' ').length;
      
      // Length-based scoring
      if (answerLength < 50) {
        score += 20;
        feedback += 'Answer is quite brief. ';
      } else if (answerLength < 200) {
        score += 50;
        feedback += 'Good answer length. ';
      } else if (answerLength < 500) {
        score += 80;
        feedback += 'Well-detailed response. ';
      } else {
        score += 70;
        feedback += 'Very comprehensive answer. ';
      }
      
      // Category-specific analysis
      if (category === 'technical') {
        const technicalKeywords = ['algorithm', 'complexity', 'performance', 'optimization', 'database', 'API', 'framework', 'design pattern'];
        const keywordMatches = technicalKeywords.filter(keyword => 
          answer.toLowerCase().includes(keyword.toLowerCase())
        ).length;
        
        score += keywordMatches * 5;
        
        if (keywordMatches > 0) {
          feedback += 'Good use of technical terminology. ';
        }
      } else if (category === 'behavioral') {
        const behavioralKeywords = ['experience', 'team', 'project', 'challenge', 'solution', 'learned', 'improved'];
        const keywordMatches = behavioralKeywords.filter(keyword => 
          answer.toLowerCase().includes(keyword.toLowerCase())
        ).length;
        
        score += keywordMatches * 4;
        
        if (answer.toLowerCase().includes('example') || answer.toLowerCase().includes('instance')) {
          score += 10;
          feedback += 'Good use of specific examples. ';
        }
      }
      
      // Difficulty adjustment
      const difficultyMultipliers = {
        beginner: 1.1,
        intermediate: 1.0,
        advanced: 0.9,
        expert: 0.8
      };
      
      score = Math.min(Math.round(score * (difficultyMultipliers[difficulty] || 1.0)), 100);
      
      // Generate feedback based on score
      if (score >= 80) {
        feedback += 'Excellent answer with good depth and clarity.';
      } else if (score >= 60) {
        feedback += 'Good answer, but could be improved with more details or examples.';
      } else if (score >= 40) {
        feedback += 'Adequate answer, but needs more depth and specific examples.';
      } else {
        feedback += 'Answer needs significant improvement. Consider providing more details and examples.';
      }
      
      return {
        score,
        feedback: feedback.trim()
      };
      
    } catch (error) {
      logger.error('Error analyzing answer:', error);
      throw new Error('Failed to analyze answer');
    }
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

module.exports = new AIService();
