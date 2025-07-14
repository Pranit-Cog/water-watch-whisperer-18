
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Flame, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  totalPoints: number;
  streak: number;
  progressPercentage: number;
}

const StatsCards = ({ totalPoints, streak, progressPercentage }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
        <CardContent className="p-6 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
              <Trophy size={32} className="text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{totalPoints.toLocaleString()}</div>
          <div className="text-sm text-white/70 font-medium tracking-wide">TOTAL POINTS</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
        <CardContent className="p-6 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
              <Flame size={32} className="text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{streak}</div>
          <div className="text-sm text-white/70 font-medium tracking-wide">DAY STREAK</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
        <CardContent className="p-6 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
              <TrendingUp size={32} className="text-white drop-shadow-lg" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{Math.round(progressPercentage)}%</div>
          <div className="text-sm text-white/70 font-medium tracking-wide">TODAY'S PROGRESS</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
