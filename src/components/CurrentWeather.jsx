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
  
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
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
            <img 
              src={weatherIconUrl} 
              alt={currentWeather.weather[0].description}
              className="weather-icon"
            />
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
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">{currentWeather.wind?.speed || 0} m/s</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Visibility</span>
              <span className="detail-value">{(currentWeather.visibility / 1000).toFixed(1)} km</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Sunrise</span>
              <span className="detail-value">{formatTime(currentWeather.sys.sunrise)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Sunset</span>
              <span className="detail-value">{formatTime(currentWeather.sys.sunset)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
