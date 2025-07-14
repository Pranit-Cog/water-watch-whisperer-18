
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Thermometer, Zap, AlertCircle } from 'lucide-react';
import { LocationData, WeatherData } from '@/services/locationService';
import { HydrationGoal } from '@/services/goalService';

interface LocationWeatherDisplayProps {
  loading: boolean;
  locationData: LocationData | null;
  weatherData: WeatherData | null;
  hydrationGoal: HydrationGoal | null;
  permissionDenied: boolean;
  waterGoal: number;
  onRefetch: () => void;
}

const LocationWeatherDisplay = ({ 
  loading, 
  locationData, 
  weatherData, 
  hydrationGoal, 
  permissionDenied, 
  waterGoal, 
  onRefetch 
}: LocationWeatherDisplayProps) => {
  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 text-white/70">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
            <span className="font-medium">Analyzing your environment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-50"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2">
                <MapPin className="text-blue-300" size={20} />
              </div>
            </div>
            <div>
              <div className="font-semibold text-white">{locationData?.city || 'Unknown'}</div>
              <div className="text-sm text-white/70">{locationData?.country || 'Location'}</div>
            </div>
          </div>
          
          {weatherData && (
            <>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-400 rounded-full blur-md opacity-50"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2">
                    <Thermometer className="text-orange-300" size={20} />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-white">{weatherData.temperature}°C</div>
                  <div className="text-sm text-white/70">Feels {weatherData.feelsLike}°C</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-50"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2">
                    <Zap className="text-cyan-300" size={20} />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-white">Goal: {waterGoal} glasses</div>
                  <div className="text-sm text-white/70">Humidity: {weatherData.humidity}%</div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {permissionDenied && (
          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-xl backdrop-blur-sm flex items-center gap-3">
            <AlertCircle className="text-yellow-300" size={20} />
            <div className="flex-1">
              <span className="text-sm text-yellow-100">
                Location access needed for personalized goals.{' '}
                <button onClick={onRefetch} className="underline hover:no-underline font-medium">
                  Enable location
                </button>
              </span>
            </div>
          </div>
        )}
        
        {hydrationGoal && (
          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-xl backdrop-blur-sm">
            <div className="text-sm text-cyan-100 font-medium">{hydrationGoal.recommendation}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationWeatherDisplay;
