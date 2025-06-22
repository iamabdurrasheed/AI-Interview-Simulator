import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '../../services/interviewService';
import { Play, Settings, User, Clock, Briefcase } from 'lucide-react';

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidateName: '',
    role: '',
    experience: '',
    duration: '30',
    difficulty: 'intermediate',
    focusAreas: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
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
    'Business Analyst'
  ];

  const focusAreaOptions = [
    'Technical Skills',
    'Problem Solving',
    'System Design',
    'Behavioral Questions',
    'Communication',
    'Leadership',
    'Project Management',
    'Algorithms & Data Structures'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocusAreaChange = (area) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const interview = await interviewService.createInterview(formData);
      navigate(`/interview/${interview.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create interview session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-setup">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', marginBottom: '16px', fontSize: '2.5rem' }}>
            Setup Your Interview
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
            Customize your mock interview experience to match your target role and goals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          {error && <div className="error">{error}</div>}

          <div className="form-group">
            <label htmlFor="candidateName">
              <User size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Your Name
            </label>
            <input
              type="text"
              id="candidateName"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <Briefcase size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Target Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience">
              <Settings size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Years of Experience
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
            >
              <option value="">Select experience level</option>
              <option value="0-1">0-1 years (Entry Level)</option>
              <option value="2-4">2-4 years (Junior)</option>
              <option value="5-7">5-7 years (Mid-Level)</option>
              <option value="8-12">8-12 years (Senior)</option>
              <option value="12+">12+ years (Lead/Principal)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">
              <Clock size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Interview Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
            >
              <option value="15">15 minutes (Quick Practice)</option>
              <option value="30">30 minutes (Standard)</option>
              <option value="45">45 minutes (Comprehensive)</option>
              <option value="60">60 minutes (Full Interview)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty Level</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="form-group">
            <label>Focus Areas (Select all that apply)</label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '12px',
              marginTop: '12px'
            }}>
              {focusAreaOptions.map(area => (
                <label 
                  key={area}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.focusAreas.includes(area)}
                    onChange={() => handleFocusAreaChange(area)}
                    style={{ marginRight: '8px' }}
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ 
                fontSize: '1.1rem', 
                padding: '16px 32px',
                minWidth: '200px'
              }}
            >
              {loading ? (
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
              ) : (
                <>
                  <Play size={20} style={{ marginRight: '8px' }} />
                  Start Interview
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewSetup;
