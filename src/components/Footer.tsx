
import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto py-8 border-t border-border/30 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="text-sm font-medium text-foreground transition-colors hover:text-foreground/70">
            Breakfast Burst
          </Link>

          <p className="text-xs text-muted-foreground">
            &copy; {year} Breakfast Burst. All rights reserved.
          </p>

          <p className="text-xs text-muted-foreground">
            Made for breakfast lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
