
interface DayData {
  date: string;
  waterCount: number;
  goalMet: boolean;
  points: number;
  goal: number;
}

// Generate synthetic data for demonstration
const generateSyntheticData = (waterGoal: number): DayData[] => {
  const data: DayData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate realistic water intake patterns
    const baseIntake = waterGoal * (0.6 + Math.random() * 0.5); // 60-110% of goal
    const waterCount = Math.max(0, Math.floor(baseIntake));
    const goalMet = waterCount >= waterGoal;
    const points = goalMet ? 100 : Math.floor((waterCount / waterGoal) * 100);
    
    data.push({
      date: date.toISOString().split('T')[0],
      waterCount,
      goalMet,
      points,
      goal: waterGoal
    });
  }
  return data;
};

export const initializeWeeklyData = (waterGoal: number): DayData[] => {
  // Check if we should use synthetic data
  const useSynthetic = !localStorage.getItem('hydrate-data');
  
  if (useSynthetic) {
    return generateSyntheticData(waterGoal);
  }
  
  const data: DayData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      waterCount: 0,
      goalMet: false,
      points: 0,
      goal: waterGoal
    });
  }
  return data;
};

export const updateDayData = (
  weeklyData: DayData[], 
  newWaterCount: number, 
  waterGoal: number
): DayData[] => {
  const todayDate = new Date().toISOString().split('T')[0];
  const updatedData = [...weeklyData];
  const todayIndex = updatedData.findIndex(d => d.date === todayDate);
  
  if (todayIndex >= 0) {
    updatedData[todayIndex] = {
      ...updatedData[todayIndex],
      waterCount: newWaterCount,
      goalMet: newWaterCount >= waterGoal,
      points: newWaterCount >= waterGoal ? 100 : Math.floor((newWaterCount / waterGoal) * 100),
      goal: waterGoal
    };
  } else {
    updatedData.push({
      date: todayDate,
      waterCount: newWaterCount,
      goalMet: newWaterCount >= waterGoal,
      points: newWaterCount >= waterGoal ? 100 : Math.floor((newWaterCount / waterGoal) * 100),
      goal: waterGoal
    });
    updatedData.splice(0, updatedData.length - 7);
  }
  
  return updatedData;
};

export const calculateStreakAndPoints = (data: DayData[]): { streak: number; points: number } => {
  let currentStreak = 0;
  let points = 0;
  
  data.forEach(day => {
    points += day.points;
  });
  
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  for (const day of sortedData) {
    if (day.goalMet) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return { streak: currentStreak, points };
};

export const loadSavedData = () => {
  const savedData = localStorage.getItem('hydrate-data');
  const savedPoints = localStorage.getItem('hydrate-points');
  const savedStreak = localStorage.getItem('hydrate-streak');
  
  return {
    weeklyData: savedData ? JSON.parse(savedData) : null,
    totalPoints: savedPoints ? parseInt(savedPoints) : 0,
    streak: savedStreak ? parseInt(savedStreak) : 0
  };
};

export const saveData = (weeklyData: DayData[], points: number, streak: number) => {
  localStorage.setItem('hydrate-data', JSON.stringify(weeklyData));
  localStorage.setItem('hydrate-points', points.toString());
  localStorage.setItem('hydrate-streak', streak.toString());
};
