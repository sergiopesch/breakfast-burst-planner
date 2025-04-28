
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';

type CtaButtonProps = {
  to: string;
  children: React.ReactNode;
};

const CtaButton: React.FC<CtaButtonProps> = ({ to, children }) => {
  const theme = useTheme();
  
  return (
    <Link 
      to={to} 
      className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-lg text-white transition-all duration-300 hover:shadow-lg"
      style={{ 
        backgroundColor: theme.colors.primary,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = `${theme.colors.secondary}`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = `${theme.colors.primary}`;
      }}
    >
      {children}
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
};

export default CtaButton;
