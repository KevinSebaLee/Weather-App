import React, { useState, useEffect } from 'react';
import { testApiKey, getApiKeyStatus } from '../utils/apiTest';
import './ApiStatus.css';

const ApiStatus = ({ onClose }) => {
  const [status, setStatus] = useState({ status: 'testing', message: 'Testing API key...' });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkApiStatus = async () => {
      const result = await getApiKeyStatus();
      setStatus(result);
    };

    checkApiStatus();
  }, []);

  const handleRetry = async () => {
    setStatus({ status: 'testing', message: 'Retesting API key...' });
    const result = await getApiKeyStatus();
    setStatus(result);
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose && onClose();
  };

  if (!isVisible || status.status === 'active') {
    return null;
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'testing':
        return '🔄';
      case 'invalid':
        return '⚠️';
      case 'rate_limited':
        return '⏳';
      case 'error':
        return '❌';
      default:
        return '✅';
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'testing':
        return '#3b82f6';
      case 'invalid':
        return '#f59e0b';
      case 'rate_limited':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#10b981';
    }
  };

  return (
    <div className="api-status-overlay">
      <div className="api-status-modal">
        <div className="api-status-header">
          <div className="status-icon" style={{ color: getStatusColor() }}>
            {getStatusIcon()}
          </div>
          <h3 className="status-title">API Status Check</h3>
          <button className="close-button" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="api-status-content">
          <p className="status-message">{status.message}</p>
          
          {status.suggestion && (
            <div className="status-suggestion">
              <strong>Suggestion:</strong> {status.suggestion}
            </div>
          )}

          {status.status === 'invalid' && (
            <div className="api-key-info">
              <h4>About OpenWeatherMap API Keys:</h4>
              <ul>
                <li>New API keys can take <strong>up to 2 hours</strong> to become active</li>
                <li>Make sure you've activated your account via the email confirmation</li>
                <li>Check your API key status at <a href="https://openweathermap.org/api_keys" target="_blank" rel="noopener noreferrer">openweathermap.org/api_keys</a></li>
                <li>Free tier includes 1,000 API calls per month</li>
              </ul>
            </div>
          )}

          {status.data && (
            <div className="api-test-data">
              <h4>Test Data Received:</h4>
              <p>Location: {status.data.name}, {status.data.sys.country}</p>
              <p>Temperature: {Math.round(status.data.main.temp)}°C</p>
              <p>Weather: {status.data.weather[0].description}</p>
            </div>
          )}
        </div>

        <div className="api-status-actions">
          <button className="retry-button" onClick={handleRetry} disabled={status.status === 'testing'}>
            {status.status === 'testing' ? 'Testing...' : 'Test Again'}
          </button>
          <button className="dismiss-button" onClick={handleClose}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiStatus;
