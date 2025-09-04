import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useSettings } from '../contexts/SettingsContext';
import './WeatherForecast.css';

const WeatherForecast = () => {
  const { forecastData } = useWeather();
  const { convertTemperature, getTemperatureSymbol } = useSettings();

  if (!forecastData || !forecastData.list) {
    return null;
  }

  // Group forecasts by day and get one forecast per day (preferably midday)
  const getDailyForecasts = () => {
    const dailyForecasts = {};
    
    forecastData.list.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyForecasts[dateKey] || date.getHours() === 12) {
        dailyForecasts[dateKey] = forecast;
      }
    });

    return Object.values(dailyForecasts).slice(0, 5); // Next 5 days
  };

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { weekday: 'short' });
    }
  };

  const dailyForecasts = getDailyForecasts();

  return (
    <div className="weather-forecast slide-in-right">
      <h3 className="forecast-title">Pronóstico de 5 días</h3>
      <div className="forecast-list">
        {dailyForecasts.map((forecast, index) => {
          const temp = convertTemperature(forecast.main.temp);
          const tempMin = convertTemperature(forecast.main.temp_min);
          const tempMax = convertTemperature(forecast.main.temp_max);
          const weatherIconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

          return (
            <div key={forecast.dt} className="forecast-item">
              <div className="forecast-day">
                {formatDay(forecast.dt)}
              </div>
              
              <div className="forecast-weather">
                <img 
                  src={weatherIconUrl} 
                  alt={forecast.weather[0].description}
                  className="forecast-icon"
                />
                <span className="forecast-description">
                  {forecast.weather[0].main}
                </span>
              </div>
              
              <div className="forecast-details">
                <div className="forecast-humidity">
                  <span className="humidity-icon">💧</span>
                  <span>{forecast.main.humidity}%</span>
                </div>
              </div>

              <div className="forecast-temperature">
                <span className="temp-high">{tempMax}{getTemperatureSymbol()}</span>
                <span className="temp-divider">/</span>
                <span className="temp-low">{tempMin}{getTemperatureSymbol()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
