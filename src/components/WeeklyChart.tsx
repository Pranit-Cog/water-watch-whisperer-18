
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DayData {
  date: string;
  waterCount: number;
  goalMet: boolean;
  points: number;
  goal: number;
}

interface WeeklyChartProps {
  weeklyData: DayData[];
  waterGoal: number;
}

const WeeklyChart = ({ weeklyData, waterGoal }: WeeklyChartProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-white font-light">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-50"></div>
            <TrendingUp className="relative text-emerald-300 drop-shadow-lg" size={24} />
          </div>
          Weekly Flow Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                fontSize={12}
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <YAxis 
                domain={[0, Math.max(waterGoal + 2, 10)]} 
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <Tooltip 
                labelFormatter={(label) => formatDate(label)}
                formatter={(value: number, name: string) => {
                  if (name === 'waterCount') return [`${value} glasses`, 'Water Intake'];
                  if (name === 'goal') return [`${value} glasses`, 'Daily Goal'];
                  return [value, name];
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="waterCount" 
                stroke="#06b6d4" 
                strokeWidth={4}
                dot={{ fill: '#06b6d4', strokeWidth: 3, r: 6 }}
                activeDot={{ r: 10, fill: '#0891b2', stroke: '#67e8f9', strokeWidth: 2 }}
                filter="drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))"
              />
              <Line 
                type="monotone" 
                dataKey="goal" 
                stroke="#f97316" 
                strokeDasharray="8 4"
                strokeWidth={3}
                dot={false}
                filter="drop-shadow(0 0 4px rgba(249, 115, 22, 0.5))"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-white/60 mt-4 text-center font-medium">
          <span className="inline-flex items-center gap-2">
            <div className="w-4 h-0.5 bg-orange-500 opacity-70"></div>
            Climate-adjusted daily target: {waterGoal} glasses
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChart;
