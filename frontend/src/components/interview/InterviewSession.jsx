import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../../services/interviewService';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { Mic, MicOff, SkipForward, Square, Clock, MessageSquare } from 'lucide-react';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    isListening,
    transcript,
    confidence,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  useEffect(() => {
    loadInterview();
  }, [id]);

  useEffect(() => {
    if (interview && !sessionStartTime) {
      setSessionStartTime(Date.now());
      setTimeRemaining(interview.duration * 60); // Convert to seconds
    }
  }, [interview, sessionStartTime]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && sessionStartTime) {
      handleFinishInterview();
    }
  }, [timeRemaining, sessionStartTime]);

  const loadInterview = async () => {
    try {
      const interviewData = await interviewService.getInterview(id);
      setInterview(interviewData);
      setQuestions(interviewData.questions || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load interview');
      setLoading(false);
    }
  };

  const handleStartRecording = () => {
    resetTranscript();
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) return;

    const answer = {
      questionIndex: currentQuestion,
      question: questions[currentQuestion]?.text || '',
      answer: transcript,
      confidence: confidence,
      timestamp: Date.now(),
      duration: 0 // Could be calculated based on recording time
    };

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    try {
      await interviewService.submitAnswer(id, answer);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }

    resetTranscript();
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleFinishInterview();
    }
  };

  const handleSkipQuestion = () => {
    const answer = {
      questionIndex: currentQuestion,
      question: questions[currentQuestion]?.text || '',
      answer: '(Skipped)',
      confidence: 0,
      timestamp: Date.now(),
      duration: 0
    };

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleFinishInterview();
    }
  };

  const handleFinishInterview = async () => {
    try {
      await interviewService.finishInterview(id, answers);
      navigate(`/results/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to finish interview');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (questions.length === 0) return 0;
    return ((currentQuestion + 1) / questions.length) * 100;
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

  if (!interview || questions.length === 0) {
    return (
      <div className="container">
        <div className="error">Interview not found or no questions available</div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="interview-session">
      <div className="container">
        <div className="interview-header">
          <div>
            <h2 style={{ margin: 0, color: '#333' }}>
              {interview.candidateName} - {interview.role}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#6c757d' }}>
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          
          <div className="interview-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: timeRemaining < 300 ? '#dc3545' : '#333',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              <Clock size={20} style={{ marginRight: '8px' }} />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        <div className="question-card">
          <div style={{ marginBottom: '24px' }}>
            <span style={{ 
              background: '#667eea', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {currentQuestionData?.category || 'General'}
            </span>
          </div>
          
          <h3 className="question-text">
            {currentQuestionData?.text}
          </h3>

          <div className="recording-controls">
            <button
              className={`record-btn ${isListening ? 'recording' : ''}`}
              onClick={isListening ? handleStopRecording : handleStartRecording}
              title={isListening ? 'Stop Recording' : 'Start Recording'}
            >
              {isListening ? <MicOff /> : <Mic />}
            </button>
          </div>

          {isListening && (
            <div className="audio-visualizer">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="audio-bar"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px',
            marginTop: '24px'
          }}>
            <button
              className="btn btn-secondary"
              onClick={handleSkipQuestion}
              disabled={isListening}
            >
              <SkipForward size={16} style={{ marginRight: '8px' }} />
              Skip Question
            </button>
            
            <button
              className="btn btn-primary"
              onClick={handleSubmitAnswer}
              disabled={!transcript.trim() || isListening}
            >
              <MessageSquare size={16} style={{ marginRight: '8px' }} />
              Submit Answer
            </button>
            
            <button
              className="btn"
              onClick={handleFinishInterview}
              style={{ 
                background: '#dc3545', 
                color: 'white',
                border: 'none'
              }}
            >
              <Square size={16} style={{ marginRight: '8px' }} />
              End Interview
            </button>
          </div>
        </div>

        {transcript && (
          <div className="transcript-section">
            <h4 style={{ marginBottom: '16px', color: '#333' }}>
              Current Response:
            </h4>
            <div className="transcript-text">
              {transcript}
            </div>
            {confidence && (
              <div style={{ 
                marginTop: '12px', 
                fontSize: '14px', 
                color: '#6c757d' 
              }}>
                Confidence: {Math.round(confidence * 100)}%
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
