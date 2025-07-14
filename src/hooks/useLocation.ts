
import { useState, useEffect } from 'react';
import { LocationData, WeatherData, getCurrentLocation, getWeatherData } from '@/services/locationService';
import { HydrationGoal, calculateHydrationGoal } from '@/services/goalService';

export const useLocation = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hydrationGoal, setHydrationGoal] = useState<HydrationGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const fetchLocationAndWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const location = await getCurrentLocation();
      setLocationData(location);
      
      const weather = await getWeatherData(location.latitude, location.longitude);
      setWeatherData(weather);
      
      const goal = calculateHydrationGoal(weather, location);
      setHydrationGoal(goal);
      
    } catch (err: any) {
      console.log('Location/Weather error:', err);
      setError(err.message);
      
      if (err.message.includes('denied') || err.code === 1) {
        setPermissionDenied(true);
        // Use default values for denied permission
        const defaultWeather: WeatherData = {
          temperature: 25,
          humidity: 60,
          weatherCondition: 'moderate',
          feelsLike: 26
        };
        const defaultLocation: LocationData = {
          latitude: 0,
          longitude: 0,
          city: 'Your Location',
          country: 'Unknown'
        };
        
        setWeatherData(defaultWeather);
        setLocationData(defaultLocation);
        setHydrationGoal(calculateHydrationGoal(defaultWeather, defaultLocation));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  return {
    locationData,
    weatherData,
    hydrationGoal,
    loading,
    error,
    permissionDenied,
    refetch: fetchLocationAndWeather
  };
};
