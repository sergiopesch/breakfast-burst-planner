
import { 
  startOfWeek, 
  startOfMonth, 
  eachDayOfInterval,
  endOfWeek,
  endOfMonth,
  addDays,
  subDays,
  startOfDay,
  isSameMonth
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
    const monthEnd = endOfMonth(date);
    
    // Get the first day of the week of the month's first day
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    
    // Get the last day of the week of the month's last day
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    // Return all days in this range (gives us a proper calendar view with days from prev/next months)
    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });
  }
  
  return [];
};

export const isCurrentMonth = (date: Date, currentDate: Date): boolean => {
  return isSameMonth(date, currentDate);
};
