import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useSettings } from '../contexts/SettingsContext';
import './CurrentWeather.css';

const CurrentWeather = () => {
  const { currentWeather, loading, error } = useWeather();
  const { convertTemperature, getTemperatureSymbol } = useSettings();

  if (loading) {
    return (
      <div className="current-weather loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos del tiempo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="current-weather error">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!currentWeather) {
    return (
      <div className="current-weather no-data">
        <div className="no-data-icon">🌍</div>
        <p>¡Bienvenido! Busca una ciudad o usa tu ubicación para comenzar.</p>
      </div>
    );
  }

  const temperature = convertTemperature(currentWeather.main.temp);
  const feelsLike = convertTemperature(currentWeather.main.feels_like);
  const tempMax = convertTemperature(currentWeather.main.temp_max);
  const tempMin = convertTemperature(currentWeather.main.temp_min);
  
  const weatherIconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`;
  
  // Weather icon component for better visual representation
  const getWeatherIcon = (iconCode, description) => {
    console.log('Weather icon code:', iconCode, 'Description:', description); // Debug log
    
    // Default orange sun for clear sky conditions
    const orangeSun = (
      <div style={{ 
        width: '120px', 
        height: '120px', 
        backgroundColor: '#FFA500',
        color: '#FFFFFF',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '60px',
        fontWeight: 'bold',
        boxShadow: '0 0 30px #FFA500',
        border: '4px solid #FFD700'
      }}>
        ☀
      </div>
    );

    const iconMap = {
      '01d': orangeSun, // clear sky day - sunny
      '02d': orangeSun, // few clouds day - but still sunny
      '01n': '🌙', // clear sky night
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '03n': '☁️',
      '04d': '☁️', // broken clouds
      '04n': '☁️',
      '09d': '🌦️', // shower rain
      '09n': '🌦️',
      '10d': '🌧️', // rain day
      '10n': '🌧️', // rain night
      '11d': '⛈️', // thunderstorm
      '11n': '⛈️',
      '13d': '❄️', // snow
      '13n': '❄️',
      '50d': '🌫️', // mist
      '50n': '🌫️'
    };
    
    // If it's clear sky based on description, use orange sun regardless of icon code
    if (description && (description.toLowerCase().includes('clear') || description.toLowerCase().includes('sunny'))) {
      return orangeSun;
    }
    
    return iconMap[iconCode] || '🌤️';
  };
  
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="current-weather slide-in-left">
      <div className="weather-header">
        <div className="location-info">
          <h1 className="city-name">{currentWeather.name}</h1>
          <h2 className="country-name">{currentWeather.sys.country}</h2>
          <p className="current-date">{formatDate()}</p>
        </div>
      </div>

      <div className="weather-main">
        <div className="temperature-section">
          <div className="main-temperature">
            <span className="temperature-value">{temperature}</span>
            <span className="temperature-unit">{getTemperatureSymbol()}</span>
          </div>
          <div className="weather-description">
            <div className="weather-icon-container">
              {(currentWeather.weather[0].icon === '01d' || 
                currentWeather.weather[0].icon === '02d' ||
                currentWeather.weather[0].main.toLowerCase() === 'clear' ||
                currentWeather.weather[0].description.toLowerCase().includes('clear')) ? (
                <div className="weather-custom-icon" style={{ display: 'block' }}>
                  {getWeatherIcon(currentWeather.weather[0].icon, currentWeather.weather[0].description)}
                </div>
              ) : (
                <>
                  <div className="weather-custom-icon">
                    {getWeatherIcon(currentWeather.weather[0].icon, currentWeather.weather[0].description)}
                  </div>
                  <img 
                    src={weatherIconUrl} 
                    alt={currentWeather.weather[0].description}
                    className="weather-icon-api"
                    style={{ display: 'none' }}
                    onLoad={(e) => {
                      // Show API icon and hide custom icon when image loads successfully
                      e.target.style.display = 'block';
                      e.target.parentElement.querySelector('.weather-custom-icon').style.display = 'none';
                    }}
                    onError={(e) => {
                      // Keep custom icon visible if API icon fails
                      e.target.style.display = 'none';
                    }}
                  />
                </>
              )}
            </div>
            <p className="description-text">{currentWeather.weather[0].main}</p>
            <p className="description-detail">{currentWeather.weather[0].description}</p>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Sensación térmica</span>
              <span className="detail-value">{feelsLike}{getTemperatureSymbol()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Humedad</span>
              <span className="detail-value">{currentWeather.main.humidity}%</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Máxima / Mínima</span>
              <span className="detail-value">
                {tempMax}{getTemperatureSymbol()} / {tempMin}{getTemperatureSymbol()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Presión</span>
              <span className="detail-value">{currentWeather.main.pressure} hPa</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Velocidad del viento</span>
              <span className="detail-value">{currentWeather.wind?.speed || 0} m/s</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Visibilidad</span>
              <span className="detail-value">{(currentWeather.visibility / 1000).toFixed(1)} km</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Amanecer</span>
              <span className="detail-value">{formatTime(currentWeather.sys.sunrise)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Atardecer</span>
              <span className="detail-value">{formatTime(currentWeather.sys.sunset)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
