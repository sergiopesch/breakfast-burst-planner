
import { 
  startOfWeek, 
  startOfMonth, 
  eachDayOfInterval,
  endOfWeek,
  endOfMonth,
} from 'date-fns';

type ViewType = 'day' | 'week' | 'month';

export const getViewDates = (view: ViewType, date: Date): Date[] => {
  if (view === 'day') return [date];
  
  if (view === 'week') {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ 
      start: weekStart, 
      end: endOfWeek(date, { weekStartsOn: 1 }) 
    });
  }
  
  if (view === 'month') {
    const monthStart = startOfMonth(date);
    return eachDayOfInterval({
      start: monthStart,
      end: endOfMonth(date)
    });
  }
  
  return [];
};
