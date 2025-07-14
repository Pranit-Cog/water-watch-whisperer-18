import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';
import StatsCards from '@/components/StatsCards';
import ReminderControl from '@/components/ReminderControl';
import WeeklyChart from '@/components/WeeklyChart';
import WaterTracker from '@/components/WaterTracker';
import LocationWeatherDisplay from '@/components/LocationWeatherDisplay';
import { 
  initializeWeeklyData, 
  updateDayData, 
  calculateStreakAndPoints, 
  loadSavedData, 
  saveData 
} from '@/utils/dataManager';
import { requestNotificationPermission, showNotification } from '@/utils/notifications';

interface DayData {
  date: string;
  waterCount: number;
  goalMet: boolean;
  points: number;
  goal: number;
}

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [waterCount, setWaterCount] = useState(0);
  const [timeUntilNext, setTimeUntilNext] = useState(3600); // 1 hour in seconds
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weeklyData, setWeeklyData] = useState<DayData[]>([]);
  const [dataInitialized, setDataInitialized] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  const { locationData, weatherData, hydrationGoal, loading, error, permissionDenied, refetch } = useLocation();

  const waterGoal = hydrationGoal?.adjustedGoal || 8;
  const progressPercentage = Math.min((waterCount / waterGoal) * 100, 100);
  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!dataInitialized) {
      const { weeklyData: savedWeeklyData, totalPoints: savedPoints, streak: savedStreak } = loadSavedData();
      
      if (savedWeeklyData && savedWeeklyData.length > 0) {
        const today = savedWeeklyData.find((d: DayData) => d.date === todayDate);
        if (today) {
          setWaterCount(today.waterCount);
        }
        setWeeklyData(savedWeeklyData.slice(-7)); // Keep last 7 days
        setTotalPoints(savedPoints);
        setStreak(savedStreak);
      } else {
        // Initialize with synthetic data for demo
        const initialData = initializeWeeklyData(waterGoal);
        const { streak: initialStreak, points: initialPoints } = calculateStreakAndPoints(initialData);
        
        setWeeklyData(initialData);
        setTotalPoints(initialPoints);
        setStreak(initialStreak);
        
        // Set today's water count to something realistic for demo
        const today = initialData.find(d => d.date === todayDate);
        if (today) {
          setWaterCount(today.waterCount);
        }
        
        saveData(initialData, initialPoints, initialStreak);
      }
      
      setDataInitialized(true);
    }
  }, [waterGoal, todayDate, dataInitialized]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleUpdateDayData = (newWaterCount: number) => {
    const updatedData = updateDayData(weeklyData, newWaterCount, waterGoal);
    setWeeklyData(updatedData);
    
    const { streak: newStreak, points: newPoints } = calculateStreakAndPoints(updatedData);
    setTotalPoints(newPoints);
    setStreak(newStreak);
    
    saveData(updatedData, newPoints, newStreak);
  };

  const showWaterNotification = () => {
    showNotification();

    toast({
      title: "💧 Time to Drink Water!",
      description: "Stay hydrated and keep your body healthy!",
      duration: 5000,
    });
  };

  const startReminder = () => {
    if (!isActive) {
      setIsActive(true);
      
      intervalRef.current = setInterval(() => {
        showWaterNotification();
        setTimeUntilNext(3600);
      }, 3600000);

      timerRef.current = setInterval(() => {
        setTimeUntilNext(prev => prev > 0 ? prev - 1 : 3600);
      }, 1000);

      toast({
        title: "⏰ Reminders Started",
        description: "You'll get a water reminder every hour!",
      });
    }
  };

  const stopReminder = () => {
    if (isActive) {
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeUntilNext(3600);

      toast({
        title: "⏹️ Reminders Stopped",
        description: "Water reminders have been paused.",
      });
    }
  };

  const addWater = () => {
    const newCount = waterCount + 1;
    setWaterCount(newCount);
    handleUpdateDayData(newCount);

    if (newCount === waterGoal) {
      toast({
        title: "🎉 Goal Achieved!",
        description: `Congratulations! You've earned 100 points for meeting your daily goal!`,
        duration: 6000,
      });
    } else {
      toast({
        title: "💧 Great Job!",
        description: `You've had ${newCount} glasses of water today! (+${Math.floor(10)} points)`,
      });
    }
  };

  const resetDay = () => {
    setWaterCount(0);
    handleUpdateDayData(0);
    toast({
      title: "🔄 Day Reset",
      description: "Your water counter has been reset for a new day!",
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Modern Header */}
        <div className="text-center py-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-4">
                <Droplets 
                  size={56} 
                  className="text-cyan-300 drop-shadow-lg" 
                />
              </div>
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4 tracking-tight">
            Hydro Flow
          </h1>
          <p className="text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
            Elevate your hydration journey with AI-powered insights and personalized wellness tracking
          </p>
        </div>

        {/* Location & Weather Info */}
        <LocationWeatherDisplay
          loading={loading}
          locationData={locationData}
          weatherData={weatherData}
          hydrationGoal={hydrationGoal}
          permissionDenied={permissionDenied}
          waterGoal={waterGoal}
          onRefetch={refetch}
        />

        {/* Stats Row */}
        <StatsCards
          totalPoints={totalPoints}
          streak={streak}
          progressPercentage={progressPercentage}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Main Control Card */}
          <ReminderControl
            isActive={isActive}
            timeUntilNext={timeUntilNext}
            onStart={startReminder}
            onStop={stopReminder}
          />

          {/* Weekly Trend Chart */}
          <WeeklyChart
            weeklyData={weeklyData}
            waterGoal={waterGoal}
          />
        </div>

        {/* Water Tracker Card */}
        <WaterTracker
          waterCount={waterCount}
          waterGoal={waterGoal}
          onAddWater={addWater}
          onResetDay={resetDay}
        />

        {/* Modern Info Card */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardContent className="pt-8 pb-8">
            <div className="text-center text-white/90 space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                <p className="text-lg font-medium">
                  <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Smart Hydration</span> powered by climate intelligence
                </p>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse animation-delay-1000"></div>
              </div>
              <p className="text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
                Your personalized hydration goals adapt to your local weather conditions, ensuring optimal wellness throughout your day.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
