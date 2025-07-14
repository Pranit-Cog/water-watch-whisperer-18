
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Play, Pause } from 'lucide-react';

interface ReminderControlProps {
  isActive: boolean;
  timeUntilNext: number;
  onStart: () => void;
  onStop: () => void;
}

const ReminderControl = ({ isActive, timeUntilNext, onStart, onStop }: ReminderControlProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl text-white font-light">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-50"></div>
            <Droplets className="relative text-cyan-300 drop-shadow-lg" size={28} />
          </div>
          Hydration Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-sm text-white/60 mb-3 font-medium tracking-wide uppercase">Next reminder in</div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-30"></div>
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="text-5xl font-mono font-bold text-white drop-shadow-lg">
                {formatTime(timeUntilNext)}
              </div>
            </div>
          </div>
          <Badge 
            variant={isActive ? "default" : "secondary"} 
            className={`mt-4 px-4 py-2 text-sm font-medium ${
              isActive 
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0" 
                : "bg-white/20 text-white/80 border-white/30"
            }`}
          >
            {isActive ? "● ACTIVE" : "○ INACTIVE"}
          </Badge>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center">
          {!isActive ? (
            <Button 
              onClick={onStart}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-medium shadow-2xl border-0 transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Play className="mr-2" size={20} />
              Start Journey
            </Button>
          ) : (
            <Button 
              onClick={onStop}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 text-lg font-medium shadow-2xl border-0 transition-all duration-300 hover:scale-105"
              size="lg"
            >
              <Pause className="mr-2" size={20} />
              Pause Journey
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderControl;
