import React, { useEffect, useState } from 'react';
import { WeatherProvider, useWeather } from './contexts/WeatherContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherForecast from './components/WeatherForecast';
import ApiStatus from './components/ApiStatus';
import './App.css';

const AppContent = () => {
  const { theme } = useTheme();
  const { error } = useWeather();
  const [showApiStatus, setShowApiStatus] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Show API status dialog when there's a 401 error
  useEffect(() => {
    if (error && (error.includes('401') || error.includes('invalid') || error.includes('not activated'))) {
      setShowApiStatus(true);
    }
  }, [error]);

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="search-section">
            <SearchBar />
          </div>
          
          <div className="weather-content">
            <div className="current-weather-section">
              <CurrentWeather />
            </div>
            
            <div className="forecast-section">
              <WeatherForecast />
            </div>
          </div>
        </div>
      </main>

      {showApiStatus && (
        <ApiStatus onClose={() => setShowApiStatus(false)} />
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <WeatherProvider>
          <AppContent />
        </WeatherProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
