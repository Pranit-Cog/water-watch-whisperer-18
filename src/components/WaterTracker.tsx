
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, RotateCcw } from 'lucide-react';

interface WaterTrackerProps {
  waterCount: number;
  waterGoal: number;
  onAddWater: () => void;
  onResetDay: () => void;
}

const WaterTracker = ({ waterCount, waterGoal, onAddWater, onResetDay }: WaterTrackerProps) => {
  const progressPercentage = Math.min((waterCount / waterGoal) * 100, 100);

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-3 text-white font-light">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-50"></div>
              <Droplets className="relative text-cyan-300 drop-shadow-lg" size={24} />
            </div>
            Daily Hydration Flow
          </span>
          <Button
            onClick={onResetDay}
            variant="outline"
            size="sm"
            className="text-white/80 border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between text-white/90 font-medium">
            <span>{waterCount} / {waterGoal} glasses</span>
            <span className="text-cyan-300">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="relative">
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Water Glasses Visualization */}
        <div className="grid grid-cols-4 gap-3">
          {[...Array(waterGoal)].map((_, index) => (
            <div
              key={index}
              className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                index < waterCount
                  ? 'bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border-cyan-300/50 text-cyan-300 shadow-lg shadow-cyan-500/25 backdrop-blur-sm'
                  : 'bg-white/5 border-white/20 text-white/40 backdrop-blur-sm'
              }`}
            >
              <Droplets size={24} className="drop-shadow-sm" />
            </div>
          ))}
        </div>

        {/* Add Water Button */}
        <Button 
          onClick={onAddWater}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-4 text-lg font-medium shadow-2xl border-0 transition-all duration-300 hover:scale-105"
          size="lg"
        >
          <Droplets className="mr-3" size={24} />
          Add Glass (+1)
        </Button>

        {/* Goal Achievement */}
        {waterCount >= waterGoal && (
          <div className="text-center p-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-2xl backdrop-blur-sm">
            <div className="text-4xl mb-3">🌊</div>
            <div className="text-emerald-300 font-bold text-lg mb-2">
              Flow State Achieved!
            </div>
            <div className="text-white/80 text-sm">
              +100 Points Earned! Your hydration journey continues to inspire!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaterTracker;
