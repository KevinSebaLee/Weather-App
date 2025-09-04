import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useWeather } from '../contexts/WeatherContext';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { temperatureUnit, toggleTemperatureUnit, getUnitLabel } = useSettings();
  const { getCurrentLocation, loading } = useWeather();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="app-title">
            <span className="weather-icon">🌤️</span>
            Weather App
          </h1>
        </div>

        <div className="header-controls">
            <button
              className="control-btn location-btn"
              onClick={getCurrentLocation}
              disabled={loading}
              title="Obtener el clima de mi ubicación actual"
            >
              {loading ? (
                <div className="mini-spinner"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              )}
              <span className="btn-text">Mi Ubicación</span>
            </button>

            <button
              className="control-btn unit-btn"
              onClick={toggleTemperatureUnit}
              title={`Cambiar a ${temperatureUnit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
            >
              <span className="unit-symbol">
                {temperatureUnit === 'metric' ? '°C' : '°F'}
              </span>
              <span className="btn-text">{getUnitLabel()}</span>
            </button>

          <button
            className="control-btn theme-btn"
            onClick={toggleTheme}
            title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
          >
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
            <span className="btn-text">{isDark ? 'Claro' : 'Oscuro'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
