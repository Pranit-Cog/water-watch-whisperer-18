
import { WeatherData, LocationData } from './locationService';

export interface HydrationGoal {
  baseGoal: number;
  adjustedGoal: number;
  factors: {
    temperature: number;
    humidity: number;
    climate: number;
    activity: number;
  };
  recommendation: string;
}

export const calculateHydrationGoal = (
  weatherData: WeatherData,
  locationData: LocationData,
  activityLevel: 'low' | 'moderate' | 'high' = 'moderate'
): HydrationGoal => {
  const baseGoal = 8; // Base 8 glasses per day
  let adjustedGoal = baseGoal;
  
  const factors = {
    temperature: 0,
    humidity: 0,
    climate: 0,
    activity: 0
  };

  // Temperature adjustment
  if (weatherData.temperature > 30) {
    factors.temperature = 2;
    adjustedGoal += 2;
  } else if (weatherData.temperature > 25) {
    factors.temperature = 1;
    adjustedGoal += 1;
  } else if (weatherData.temperature < 10) {
    factors.temperature = -1;
    adjustedGoal -= 1;
  }

  // Humidity adjustment
  if (weatherData.humidity > 80) {
    factors.humidity = 1;
    adjustedGoal += 1;
  } else if (weatherData.humidity < 30) {
    factors.humidity = 1;
    adjustedGoal += 1;
  }

  // Climate condition adjustment
  const hotConditions = ['clear', 'sunny'];
  const moderateConditions = ['clouds', 'mist', 'fog'];
  
  if (hotConditions.includes(weatherData.weatherCondition)) {
    factors.climate = 1;
    adjustedGoal += 1;
  }

  // Activity level adjustment
  switch (activityLevel) {
    case 'high':
      factors.activity = 2;
      adjustedGoal += 2;
      break;
    case 'moderate':
      factors.activity = 1;
      adjustedGoal += 1;
      break;
    case 'low':
      factors.activity = 0;
      break;
  }

  // Ensure minimum goal
  adjustedGoal = Math.max(adjustedGoal, 6);
  
  // Generate recommendation
  let recommendation = `Based on your location (${locationData.city}) `;
  
  if (weatherData.temperature > 30) {
    recommendation += "and hot weather conditions, increase your water intake significantly.";
  } else if (weatherData.temperature > 25) {
    recommendation += "and warm weather, stay well hydrated throughout the day.";
  } else if (weatherData.temperature < 10) {
    recommendation += "and cool weather, maintain regular hydration even if you feel less thirsty.";
  } else {
    recommendation += "and moderate climate, maintain steady hydration levels.";
  }

  return {
    baseGoal,
    adjustedGoal,
    factors,
    recommendation
  };
};
