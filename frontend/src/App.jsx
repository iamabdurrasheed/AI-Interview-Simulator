import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './components/pages/Home';
import InterviewSetup from './components/interview/InterviewSetup';
import InterviewSession from './components/interview/InterviewSession';
import InterviewResults from './components/interview/InterviewResults';
import Dashboard from './components/pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup" element={<InterviewSetup />} />
            <Route path="/interview/:id" element={<InterviewSession />} />
            <Route path="/results/:id" element={<InterviewResults />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
