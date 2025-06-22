import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { interviewService } from '../../services/interviewService';
import { 
  Award, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  Download, 
  Home,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const InterviewResults = () => {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResults();
  }, [id]);

  const loadResults = async () => {
    try {
      const resultsData = await interviewService.getResults(id);
      setResults(resultsData);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load results');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle size={24} />;
    if (score >= 60) return <AlertCircle size={24} />;
    return <AlertCircle size={24} />;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container">
        <div className="error">Results not found</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', marginBottom: '16px', fontSize: '2.5rem' }}>
            Interview Results
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
            {results.candidateName} - {results.role}
          </p>
        </div>

        <div className="results-summary">
          <div className="score-card">
            <div 
              className="score-value" 
              style={{ color: getScoreColor(results.overallScore) }}
            >
              {results.overallScore}%
            </div>
            <div className="score-label">Overall Score</div>
            <div style={{ marginTop: '8px', color: getScoreColor(results.overallScore) }}>
              {getScoreIcon(results.overallScore)}
            </div>
          </div>

          <div className="score-card">
            <div className="score-value" style={{ color: '#667eea' }}>
              <Clock size={28} />
            </div>
            <div className="score-label">Duration</div>
            <div style={{ marginTop: '8px', fontSize: '1.1rem', fontWeight: '600' }}>
              {Math.round(results.duration / 60)} min
            </div>
          </div>

          <div className="score-card">
            <div className="score-value" style={{ color: '#28a745' }}>
              {results.questionsAnswered}
            </div>
            <div className="score-label">Questions Answered</div>
            <div style={{ marginTop: '8px', fontSize: '1.1rem', fontWeight: '600' }}>
              of {results.totalQuestions}
            </div>
          </div>

          <div className="score-card">
            <div 
              className="score-value" 
              style={{ color: getScoreColor(results.communicationScore) }}
            >
              {results.communicationScore}%
            </div>
            <div className="score-label">Communication</div>
            <div style={{ marginTop: '8px', color: getScoreColor(results.communicationScore) }}>
              <MessageSquare size={24} />
            </div>
          </div>
        </div>

        <div className="feedback-section">
          <h2 style={{ marginBottom: '24px', color: '#333', fontSize: '1.8rem' }}>
            <Award size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
            Detailed Feedback
          </h2>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ color: '#333', marginBottom: '16px' }}>Performance Summary</h3>
            <p style={{ color: '#495057', lineHeight: '1.6', fontSize: '16px' }}>
              {results.summary || 'Great job completing the interview! Your responses showed good understanding of the role requirements.'}
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ color: '#333', marginBottom: '16px' }}>Strengths</h3>
            <ul style={{ color: '#495057', lineHeight: '1.8' }}>
              {results.strengths?.map((strength, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <CheckCircle size={16} style={{ color: '#28a745', marginRight: '8px', verticalAlign: 'middle' }} />
                  {strength}
                </li>
              )) || [
                <li key="default">Clear communication and well-structured responses</li>
              ]}
            </ul>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ color: '#333', marginBottom: '16px' }}>Areas for Improvement</h3>
            <ul style={{ color: '#495057', lineHeight: '1.8' }}>
              {results.improvements?.map((improvement, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <TrendingUp size={16} style={{ color: '#ffc107', marginRight: '8px', verticalAlign: 'middle' }} />
                  {improvement}
                </li>
              )) || [
                <li key="default">Practice more technical depth in your responses</li>
              ]}
            </ul>
          </div>

          {results.answers && results.answers.length > 0 && (
            <div>
              <h3 style={{ color: '#333', marginBottom: '24px' }}>Question & Answer Review</h3>
              {results.answers.map((item, index) => (
                <div key={index} className="feedback-item">
                  <div className="feedback-question">
                    Q{index + 1}: {item.question}
                  </div>
                  <div className="feedback-answer">
                    Your Answer: "{item.answer}"
                  </div>
                  {item.feedback && (
                    <div className="feedback-comment">
                      <strong>Feedback:</strong> {item.feedback}
                    </div>
                  )}
                  {item.score && (
                    <div style={{ 
                      display: 'inline-block',
                      background: getScoreColor(item.score),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginTop: '8px'
                    }}>
                      Score: {item.score}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => window.print()}
            >
              <Download size={16} style={{ marginRight: '8px' }} />
              Download Report
            </button>
            
            <Link to="/setup" className="btn btn-primary">
              <RefreshCw size={16} style={{ marginRight: '8px' }} />
              Take Another Interview
            </Link>
            
            <Link to="/" className="btn btn-secondary">
              <Home size={16} style={{ marginRight: '8px' }} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;
