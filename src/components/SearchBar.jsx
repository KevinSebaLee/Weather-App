import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import './SearchBar.css';

const SearchBar = () => {
  const { searchCities, searchResults, fetchWeatherByCoords, clearError } = useWeather();
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [debounceTimer, setDebounceTimer] = React.useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounced search
    const timer = setTimeout(() => {
      if (value.trim()) {
        console.log('Searching for:', value.trim()); // Debug log
        searchCities(value.trim());
      }
    }, 300);

    setDebounceTimer(timer);
  };

  const handleCitySelect = (city) => {
    clearError();
    fetchWeatherByCoords(city.lat, city.lon);
    setQuery(`${city.name}, ${city.country}`);
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // If there are search results, select the first one
      if (searchResults.length > 0) {
        handleCitySelect(searchResults[0]);
      } else {
        // Try to search one more time
        searchCities(query.trim());
      }
    }
    setIsOpen(false);
  };

  const handleBlur = () => {
    // Delay closing to allow city selection
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="search-bar fade-in">
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Buscar ciudades en todo el mundo..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length > 0 && setIsOpen(true)}
            onBlur={handleBlur}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((city, index) => (
                <div
                  key={`${city.lat}-${city.lon}-${index}`}
                  className="search-result-item"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="city-icon"></div>
                  <div className="city-info">
                    <span className="city-name">{city.name}</span>
                    <span className="city-details">
                      {city.state && `${city.state}, `}{city.country}
                    </span>
                  </div>
                </div>
              ))
            ) : query.length > 0 ? (
              <div className="search-result-item">
                <div className="city-icon" style={{background: '#ef4444'}}></div>
                <div className="city-info">
                  <span className="city-name">No results found</span>
                  <span className="city-details">Try a different search term</span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
