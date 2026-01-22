
import React from 'react';
import { CalendarDays, BookOpen, ChefHat } from "lucide-react";
import NavLink from './NavLink';

const MainNav = () => {
  return (
    <nav className="flex items-center gap-1 p-1 rounded-xl bg-muted/40">
      <NavLink to="/planner">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Planner</span>
        </div>
      </NavLink>
      <NavLink to="/recipes">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>Recipes</span>
        </div>
      </NavLink>
      <NavLink to="/create-recipe">
        <div className="flex items-center gap-2">
          <ChefHat className="h-4 w-4" />
          <span>Create</span>
        </div>
      </NavLink>
    </nav>
  );
};

export default MainNav;
