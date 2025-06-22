import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="App-header">
      <div className="container">
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0'
        }}>
          <Link to="/" style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#333',
            textDecoration: 'none'
          }}>
            🎯 AI Interview Simulator
          </Link>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              <User size={16} style={{ marginRight: '8px' }} />
              Dashboard
            </Link>
            <Link to="/setup" className="btn btn-primary">
              Start Interview
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
