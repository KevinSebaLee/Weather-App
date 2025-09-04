import { createContext, useContext, useReducer } from 'react';

const SettingsContext = createContext();

// Settings action types
const SETTINGS_ACTIONS = {
  TOGGLE_TEMPERATURE_UNIT: 'TOGGLE_TEMPERATURE_UNIT',
  SET_TEMPERATURE_UNIT: 'SET_TEMPERATURE_UNIT'
};

// Initial state - check localStorage or default to Celsius
const getInitialUnit = () => {
  if (typeof window !== 'undefined') {
    const savedUnit = localStorage.getItem('weather-app-temp-unit');
    if (savedUnit) {
      return savedUnit;
    }
  }
  return 'metric'; // metric = Celsius, imperial = Fahrenheit
};

const initialState = {
  temperatureUnit: getInitialUnit()
};

// Settings reducer
const settingsReducer = (state, action) => {
  switch (action.type) {
    case SETTINGS_ACTIONS.TOGGLE_TEMPERATURE_UNIT:
      const newUnit = state.temperatureUnit === 'metric' ? 'imperial' : 'metric';
      localStorage.setItem('weather-app-temp-unit', newUnit);
      return {
        ...state,
        temperatureUnit: newUnit
      };
    case SETTINGS_ACTIONS.SET_TEMPERATURE_UNIT:
      localStorage.setItem('weather-app-temp-unit', action.payload);
      return {
        ...state,
        temperatureUnit: action.payload
      };
    default:
      return state;
  }
};

// Settings provider component
export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  const toggleTemperatureUnit = () => {
    dispatch({ type: SETTINGS_ACTIONS.TOGGLE_TEMPERATURE_UNIT });
  };

  const setTemperatureUnit = (unit) => {
    dispatch({ type: SETTINGS_ACTIONS.SET_TEMPERATURE_UNIT, payload: unit });
  };

  // Helper functions
  const convertTemperature = (temp, fromUnit = 'metric', toUnit = null) => {
    const targetUnit = toUnit || state.temperatureUnit;
    
    if (fromUnit === targetUnit) return Math.round(temp);
    
    if (fromUnit === 'metric' && targetUnit === 'imperial') {
      return Math.round((temp * 9/5) + 32);
    }
    
    if (fromUnit === 'imperial' && targetUnit === 'metric') {
      return Math.round((temp - 32) * 5/9);
    }
    
    return Math.round(temp);
  };

  const getTemperatureSymbol = (unit = null) => {
    const targetUnit = unit || state.temperatureUnit;
    return targetUnit === 'metric' ? '°C' : '°F';
  };

  const getUnitLabel = (unit = null) => {
    const targetUnit = unit || state.temperatureUnit;
    return targetUnit === 'metric' ? 'Celsius' : 'Fahrenheit';
  };

  const value = {
    ...state,
    toggleTemperatureUnit,
    setTemperatureUnit,
    convertTemperature,
    getTemperatureSymbol,
    getUnitLabel,
    isCelsius: state.temperatureUnit === 'metric',
    isFahrenheit: state.temperatureUnit === 'imperial'
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
