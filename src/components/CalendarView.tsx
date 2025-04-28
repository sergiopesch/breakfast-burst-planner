import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Grid, Calendar as CalendarSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const getViewDates = (): Date[] => {
    if (view === 'day') return [date];
    if (view === 'week') {
      const weekStart = startOfWeek(date, {
        weekStartsOn: 1
      });
      return eachDayOfInterval({
        start: weekStart,
        end: endOfWeek(date, {
          weekStartsOn: 1
        })
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
  return <Card className="overflow-hidden bg-gradient-to-br from-white to-[#F0EBFF] border-none shadow-sm">
      <CardContent className="p-5 mx-0 px-0 py-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-[#4F2D9E] flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Calendar
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-[#4F2D9E] whitespace-nowrap">
              {view === 'day' && format(date, 'MMM d, yyyy')}
              {view === 'week' && `Week of ${format(viewDates[0], 'MMM d')}`}
              {view === 'month' && format(date, 'MMMM yyyy')}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="rounded-md overflow-hidden relative">
          <Tabs defaultValue={view} value={view} onValueChange={value => onViewChange(value as ViewType)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="day" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Day</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center gap-1">
                <Grid className="h-4 w-4" />
                <span>Week</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="flex items-center gap-1">
                <CalendarSquare className="h-4 w-4" />
                <span>Month</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-md overflow-hidden shadow-inner">
            <Calendar mode="single" selected={date} onSelect={onDateSelect} modifiers={{
            hasEvents: Object.keys(plannedMeals).map(dateKey => new Date(dateKey))
          }} modifiersStyles={{
            hasEvents: {
              fontWeight: "bold",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              textDecorationColor: "#4F2D9E"
            }
          }} className="rounded-md" styles={{
            month: {
              width: "100%"
            },
            caption: {
              padding: "0.5rem"
            },
            cell: {
              padding: "0"
            },
            table: {
              width: "100%"
            },
            head_cell: {
              padding: "0.5rem 0",
              textAlign: "center",
              fontSize: "0.75rem",
              fontWeight: "500"
            }
          }} />
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default CalendarView;