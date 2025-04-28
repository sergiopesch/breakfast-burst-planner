
import React from 'react';
import { CalendarDays, BookOpen } from "lucide-react";
import NavLink from './NavLink';

const MainNav = () => {
  return (
    <div className="flex space-x-1">
      <NavLink to="/planner">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>Planner</span>
        </div>
      </NavLink>
      <NavLink to="/recipes">
        <div className="flex items-center">
          <BookOpen className="h-4 w-4 mr-2" />
          <span>Recipes</span>
        </div>
      </NavLink>
    </div>
  );
};

export default MainNav;
