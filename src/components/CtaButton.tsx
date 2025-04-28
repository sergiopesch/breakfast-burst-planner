
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

type CtaButtonProps = {
  to: string;
  children: React.ReactNode;
};

const CtaButton: React.FC<CtaButtonProps> = ({ to, children }) => {
  return (
    <Link 
      to={to} 
      className="neumorphic inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-lg transition-all duration-300 hover:shadow-[8px_8px_20px_rgba(0,0,0,0.1),-8px_-8px_20px_rgba(255,255,255,0.8)] dark:hover:shadow-[8px_8px_20px_rgba(0,0,0,0.3),-8px_-8px_20px_rgba(255,255,255,0.05)]"
    >
      {children}
      <ChevronRight className="h-5 w-5" />
    </Link>
  );
};

export default CtaButton;
