
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sunrise } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto py-8 border-t border-border/50 bg-gradient-to-b from-transparent to-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-purple-light flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
                <Sunrise className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gradient">
                Breakfast Burst
              </span>
            </Link>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <span>&copy; {year} Breakfast Burst. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-brand-warm fill-brand-warm animate-pulse-soft" />
            <span>for breakfast lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
