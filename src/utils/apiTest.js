// API Key Test Utility
// This file helps test if the OpenWeatherMap API key is working correctly

const API_KEY = '1fe6c20b837ba3f6636254735113ae9e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const testApiKey = async () => {
  try {
    // Test with a simple weather request for London
    const testUrl = `${BASE_URL}/weather?q=London,UK&appid=${API_KEY}&units=metric`;
    
    console.log('Testing API key with URL:', testUrl);
    
    const response = await fetch(testUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ API Key is working! Test data:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ API Key test failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getApiKeyStatus = async () => {
  const result = await testApiKey();
  
  if (!result.success) {
    if (result.error.includes('401')) {
      return {
        status: 'invalid',
        message: 'API Key is invalid or not activated yet. New API keys can take up to 2 hours to become active.',
        suggestion: 'Please wait and try again later, or verify your API key at https://openweathermap.org/api_keys'
      };
    } else if (result.error.includes('429')) {
      return {
        status: 'rate_limited',
        message: 'API rate limit exceeded.',
        suggestion: 'Please wait a moment before making more requests.'
      };
    } else {
      return {
        status: 'error',
        message: result.error,
        suggestion: 'Check your internet connection and try again.'
      };
    }
  }
  
  return {
    status: 'active',
    message: 'API Key is working correctly!',
    data: result.data
  };
};
