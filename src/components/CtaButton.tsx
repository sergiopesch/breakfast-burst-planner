
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

type CtaButtonProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

const CtaButton: React.FC<CtaButtonProps> = ({ to, children, className }) => {
  const theme = useTheme();
  
  return (
    <Link 
      to={to} 
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-lg text-white transition-all duration-300 hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2",
        className
      )}
      style={{ 
        backgroundColor: theme.colors.primary,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.secondary;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.primary;
      }}
      aria-label={`Navigate to ${to}`}
    >
      {children}
      <ArrowRight className="h-5 w-5" aria-hidden="true" />
    </Link>
  );
};

export default CtaButton;
