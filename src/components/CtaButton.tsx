
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type CtaButtonProps = {
  to: string;
  children: React.ReactNode;
};

const CtaButton: React.FC<CtaButtonProps> = ({ to, children }) => {
  return (
    <Link 
      to={to} 
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4F2D9E] px-6 py-3 font-medium text-lg text-white transition-all duration-300 hover:bg-[#4F2D9E]/90 hover:shadow-lg"
    >
      {children}
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
};

export default CtaButton;
