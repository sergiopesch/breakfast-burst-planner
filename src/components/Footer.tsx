
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { Heart } from 'lucide-react';

const Footer = () => {
  const theme = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className={`text-lg ${theme.fonts.heading} bg-gradient-to-r from-[${theme.colors.primary}] to-[${theme.colors.secondary}] text-transparent bg-clip-text`}>
                MealPlan
              </span>
            </Link>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span>© {year} MealPlan. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Made with </span>
              <Heart className="h-3 w-3 mx-1 text-red-500" />
              <span> by MealPlan Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
