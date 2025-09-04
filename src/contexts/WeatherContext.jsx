import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

const WeatherContext = createContext();

// Weather action types
const WEATHER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_WEATHER_DATA: 'SET_WEATHER_DATA',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_CURRENT_LOCATION: 'SET_CURRENT_LOCATION',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_FORECAST_DATA: 'SET_FORECAST_DATA'
};

// Initial state
const initialState = {
  currentWeather: null,
  forecastData: null,
  searchResults: [],
  currentLocation: null,
  loading: false,
  error: null,
  lastFetch: null
};

// Weather reducer
const weatherReducer = (state, action) => {
  switch (action.type) {
    case WEATHER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    case WEATHER_ACTIONS.SET_WEATHER_DATA:
      return {
        ...state,
        currentWeather: action.payload,
        loading: false,
        error: null,
        lastFetch: Date.now()
      };
    case WEATHER_ACTIONS.SET_FORECAST_DATA:
      return {
        ...state,
        forecastData: action.payload,
        loading: false,
        error: null
      };
    case WEATHER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case WEATHER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case WEATHER_ACTIONS.SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.payload
      };
    case WEATHER_ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload
      };
    default:
      return state;
  }
};

// Weather provider component
export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const API_KEY = '1fe6c20b837ba3f6636254735113ae9e';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Fetch current weather
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    dispatch({ type: WEATHER_ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        let errorMessage = 'Failed to fetch weather data';
        
        if (response.status === 401) {
          errorMessage = 'API Key is invalid or not activated yet. New API keys can take up to 2 hours to become active.';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (response.status === 404) {
          errorMessage = 'Location not found. Please try a different location.';
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Use default message if can't parse error response
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      dispatch({ type: WEATHER_ACTIONS.SET_WEATHER_DATA, payload: data });
      
      // Also fetch 5-day forecast
      await fetchForecastByCoords(lat, lon);
      
    } catch (error) {
      dispatch({ type: WEATHER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [API_KEY]);

  // Fetch 5-day forecast
  const fetchForecastByCoords = useCallback(async (lat, lon) => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        let errorMessage = 'Failed to fetch forecast data';
        
        if (response.status === 401) {
          errorMessage = 'API Key is invalid or not activated yet for forecast data.';
        } else if (response.status === 429) {
          errorMessage = 'Too many forecast requests. Please wait a moment.';
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Use default message
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      dispatch({ type: WEATHER_ACTIONS.SET_FORECAST_DATA, payload: data });
      
    } catch (error) {
      // Don't dispatch error for forecast - it's secondary data
      console.warn('Forecast fetch failed:', error.message);
    }
  }, [API_KEY]);

  // Fetch weather by city name
  const fetchWeatherByCity = useCallback(async (cityName) => {
    dispatch({ type: WEATHER_ACTIONS.SET_LOADING, payload: true });

    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        let errorMessage = 'Failed to fetch weather data';
        
        if (response.status === 401) {
          errorMessage = 'API Key is invalid or not activated yet. New API keys can take up to 2 hours to become active.';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (response.status === 404) {
          errorMessage = 'City not found. Please try a different city.';
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Use default message if can't parse error response
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      dispatch({ type: WEATHER_ACTIONS.SET_WEATHER_DATA, payload: data });
      
      // Also fetch 5-day forecast
      await fetchForecastByCoords(data.coord.lat, data.coord.lon);
      
    } catch (error) {
      dispatch({ type: WEATHER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [API_KEY]);

  // Search cities
  const searchCities = useCallback(async (query) => {
    console.log('searchCities called with:', query); // Debug log
    
    if (!query.trim()) {
      dispatch({ type: WEATHER_ACTIONS.SET_SEARCH_RESULTS, payload: [] });
      return;
    }

    try {
      const searchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
      console.log('Fetching from:', searchUrl); // Debug log
      
      const response = await fetch(searchUrl);

      if (!response.ok) {
        let errorMessage = 'Failed to search cities';
        
        if (response.status === 401) {
          errorMessage = 'API Key issue while searching cities.';
        } else if (response.status === 429) {
          errorMessage = 'Too many search requests. Please wait.';
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Use default message
          }
        }
        
        console.error('Search API error:', response.status, errorMessage); // Debug log
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Search results:', data); // Debug log
      dispatch({ type: WEATHER_ACTIONS.SET_SEARCH_RESULTS, payload: data });
      
    } catch (error) {
      console.warn('City search failed:', error.message);
      dispatch({ type: WEATHER_ACTIONS.SET_SEARCH_RESULTS, payload: [] });
    }
  }, [API_KEY]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    dispatch({ type: WEATHER_ACTIONS.SET_LOADING, payload: true });

    if (!navigator.geolocation) {
      dispatch({ type: WEATHER_ACTIONS.SET_ERROR, payload: 'Geolocation is not supported by this browser.' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch({ 
          type: WEATHER_ACTIONS.SET_CURRENT_LOCATION, 
          payload: { lat: latitude, lon: longitude } 
        });
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        }
        dispatch({ type: WEATHER_ACTIONS.SET_ERROR, payload: errorMessage });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [fetchWeatherByCoords]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: WEATHER_ACTIONS.CLEAR_ERROR });
  }, []);

  // Load default city (Buenos Aires) on initial mount
  useEffect(() => {
    fetchWeatherByCity('Buenos Aires');
  }, [fetchWeatherByCity]); // Include the function in dependencies

  const value = {
    ...state,
    fetchWeatherByCoords,
    fetchWeatherByCity,
    searchCities,
    getCurrentLocation,
    clearError
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

// Custom hook to use weather context
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
