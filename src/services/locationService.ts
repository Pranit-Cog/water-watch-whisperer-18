
export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  weatherCondition: string;
  feelsLike: number;
}

export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get location details
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&limit=1`
          );
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            resolve({
              latitude,
              longitude,
              city: result.components.city || result.components.town || result.components.village || 'Unknown',
              country: result.components.country || 'Unknown'
            });
          } else {
            resolve({
              latitude,
              longitude,
              city: 'Unknown',
              country: 'Unknown'
            });
          }
        } catch (error) {
          // Fallback if geocoding fails
          resolve({
            latitude,
            longitude,
            city: 'Unknown',
            country: 'Unknown'
          });
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

export const getWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  try {
    // Using OpenWeatherMap API (demo key for testing)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=demo&units=metric`
    );
    
    if (!response.ok) {
      // Fallback to mock data if API fails
      return {
        temperature: 25,
        humidity: 60,
        weatherCondition: 'moderate',
        feelsLike: 26
      };
    }
    
    const data = await response.json();
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      weatherCondition: data.weather[0].main.toLowerCase(),
      feelsLike: Math.round(data.main.feels_like)
    };
  } catch (error) {
    console.log('Weather API failed, using default values:', error);
    // Return default moderate climate values
    return {
      temperature: 25,
      humidity: 60,
      weatherCondition: 'moderate',
      feelsLike: 26
    };
  }
};
