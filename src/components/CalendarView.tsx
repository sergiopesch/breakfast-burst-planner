
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfWeek, startOfMonth, eachDayOfInterval, endOfWeek, endOfMonth, addWeeks, subWeeks, addMonths, subMonths, addDays } from 'date-fns';

type ViewType = 'day' | 'week' | 'month';

interface CalendarViewProps {
  date: Date;
  view: ViewType;
  plannedMeals: Record<string, any>;
  onDateSelect: (date: Date | undefined) => void;
  onViewChange: (view: ViewType) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  date,
  view,
  plannedMeals,
  onDateSelect,
  onViewChange
}) => {
  // Force component to update with a unique key
  const [rerenderKey, setRerenderKey] = useState(Date.now());

  useEffect(() => {
    // Force a re-render when view changes to clear any stale cache
    setRerenderKey(Date.now());
  }, [view]);

  const getViewDates = (): Date[] => {
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

  const viewDates = getViewDates();

  const navigate = (direction: 'prev' | 'next') => {
    if (view === 'day') {
      onDateSelect(direction === 'next' ? addDays(date, 1) : addDays(date, -1));
    } else if (view === 'week') {
      onDateSelect(direction === 'next' ? addWeeks(date, 1) : subWeeks(date, 1));
    } else if (view === 'month') {
      onDateSelect(direction === 'next' ? addMonths(date, 1) : subMonths(date, 1));
    }
  };

  return (
    <div key={rerenderKey} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Calendar
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => navigate('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
            {view === 'day' && format(date, 'MMM d, yyyy')}
            {view === 'week' && `Week of ${format(viewDates[0], 'MMM d')}`}
            {view === 'month' && format(date, 'MMMM yyyy')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => navigate('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs
        defaultValue={view}
        value={view}
        onValueChange={value => onViewChange(value as ViewType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50 rounded-full p-1">
          <TabsTrigger
            value="day"
            className="rounded-full text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Day
          </TabsTrigger>
          <TabsTrigger
            value="week"
            className="rounded-full text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Week
          </TabsTrigger>
          <TabsTrigger
            value="month"
            className="rounded-full text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Month
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Calendar */}
      <div className="bg-background/50 rounded-xl overflow-hidden">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          modifiers={{
            hasEvents: Object.keys(plannedMeals).map(dateKey => new Date(dateKey))
          }}
          modifiersStyles={{
            hasEvents: {
              fontWeight: "600",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              textDecorationColor: "hsl(var(--foreground))"
            }
          }}
          className="rounded-xl border-0"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center hidden",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center hidden",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.7rem] flex-1 text-center",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative flex-1 [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-secondary/50 transition-colors mx-auto",
            day_selected: "bg-foreground text-background hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background",
            day_today: "border border-foreground/20",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-secondary aria-selected:text-secondary-foreground",
            day_hidden: "invisible",
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;
