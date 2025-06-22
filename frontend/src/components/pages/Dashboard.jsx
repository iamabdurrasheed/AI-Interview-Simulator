import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interviewService } from '../../services/interviewService';
import { 
  BarChart3, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Award,
  Eye,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    totalTime: 0,
    improvementTrend: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [interviewsData, statsData] = await Promise.all([
        interviewService.getUserInterviews(),
        interviewService.getUserStats()
      ]);
      
      setInterviews(interviewsData);
      setStats(statsData);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'rgba(255, 255, 255, 0.05)', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{ color: 'white', marginBottom: '8px', fontSize: '2.5rem' }}>
              Your Dashboard
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Track your interview progress and performance
            </p>
          </div>
          <Link to="/setup" className="btn btn-primary">
            <Plus size={16} style={{ marginRight: '8px' }} />
            New Interview
          </Link>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Stats Cards */}
        <div className="results-summary" style={{ marginBottom: '40px' }}>
          <div className="score-card">
            <div className="score-value" style={{ color: '#667eea' }}>
              {stats.totalInterviews}
            </div>
            <div className="score-label">Total Interviews</div>
            <div style={{ marginTop: '8px', color: '#667eea' }}>
              <BarChart3 size={24} />
            </div>
          </div>

          <div className="score-card">
            <div 
              className="score-value" 
              style={{ color: getScoreColor(stats.averageScore) }}
            >
              {stats.averageScore}%
            </div>
            <div className="score-label">Average Score</div>
            <div style={{ marginTop: '8px', color: getScoreColor(stats.averageScore) }}>
              <Award size={24} />
            </div>
          </div>

          <div className="score-card">
            <div className="score-value" style={{ color: '#28a745' }}>
              {formatDuration(stats.totalTime)}
            </div>
            <div className="score-label">Total Practice Time</div>
            <div style={{ marginTop: '8px', color: '#28a745' }}>
              <Clock size={24} />
            </div>
          </div>

          <div className="score-card">
            <div 
              className="score-value" 
              style={{ color: stats.improvementTrend >= 0 ? '#28a745' : '#dc3545' }}
            >
              {stats.improvementTrend >= 0 ? '+' : ''}{stats.improvementTrend}%
            </div>
            <div className="score-label">Improvement Trend</div>
            <div style={{ 
              marginTop: '8px', 
              color: stats.improvementTrend >= 0 ? '#28a745' : '#dc3545'
            }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="card">
          <h2 style={{ marginBottom: '24px', color: '#333', fontSize: '1.8rem' }}>
            Recent Interviews
          </h2>

          {interviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: '#6c757d', fontSize: '1.1rem', marginBottom: '24px' }}>
                You haven't taken any interviews yet.
              </p>
              <Link to="/setup" className="btn btn-primary">
                Take Your First Interview
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#495057',
                      fontWeight: '600'
                    }}>
                      Date
                    </th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#495057',
                      fontWeight: '600'
                    }}>
                      Role
                    </th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#495057',
                      fontWeight: '600'
                    }}>
                      Duration
                    </th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#495057',
                      fontWeight: '600'
                    }}>
                      Score
                    </th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#495057',
                      fontWeight: '600'
                    }}>
                      Status
                    </th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'center', 
                      color: '#495057',
                      fontWeight: '600'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((interview, index) => (
                    <tr 
                      key={interview.id} 
                      style={{ 
                        borderBottom: '1px solid #e9ecef',
                        '&:hover': { backgroundColor: '#f8f9fa' }
                      }}
                    >
                      <td style={{ padding: '12px', color: '#495057' }}>
                        <Calendar size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        {formatDate(interview.createdAt)}
                      </td>
                      <td style={{ padding: '12px', color: '#495057', fontWeight: '500' }}>
                        {interview.role}
                      </td>
                      <td style={{ padding: '12px', color: '#495057' }}>
                        {interview.duration} min
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          color: getScoreColor(interview.overallScore || 0),
                          fontWeight: '600'
                        }}>
                          {interview.overallScore || 0}%
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: interview.status === 'completed' ? '#d4edda' : '#fff3cd',
                          color: interview.status === 'completed' ? '#155724' : '#856404'
                        }}>
                          {interview.status || 'completed'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {interview.status === 'completed' && (
                          <Link 
                            to={`/results/${interview.id}`}
                            className="btn btn-secondary"
                            style={{ 
                              fontSize: '12px',
                              padding: '6px 12px'
                            }}
                          >
                            <Eye size={12} style={{ marginRight: '4px' }} />
                            View Results
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="card" style={{ marginTop: '32px' }}>
          <h2 style={{ marginBottom: '24px', color: '#333', fontSize: '1.8rem' }}>
            Tips for Better Performance
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px' 
          }}>
            <div>
              <h4 style={{ color: '#667eea', marginBottom: '12px' }}>
                🎯 Preparation
              </h4>
              <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                Research the company and role thoroughly. Practice common questions 
                and prepare specific examples from your experience.
              </p>
            </div>
            
            <div>
              <h4 style={{ color: '#667eea', marginBottom: '12px' }}>
                💬 Communication
              </h4>
              <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                Speak clearly and at a moderate pace. Use the STAR method 
                (Situation, Task, Action, Result) for behavioral questions.
              </p>
            </div>
            
            <div>
              <h4 style={{ color: '#667eea', marginBottom: '12px' }}>
                🔧 Technical Skills
              </h4>
              <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                For technical roles, practice coding problems and system design. 
                Explain your thought process clearly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
