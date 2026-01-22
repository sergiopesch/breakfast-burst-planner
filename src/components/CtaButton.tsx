
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type CtaButtonProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'warm';
};

const CtaButton: React.FC<CtaButtonProps> = ({ to, children, className, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-brand-purple to-brand-purple-light hover:from-brand-purple-light hover:to-brand-purple shadow-[0_4px_14px_-3px_rgba(79,45,158,0.4)] hover:shadow-[0_6px_20px_-3px_rgba(79,45,158,0.5)]',
    secondary: 'bg-white text-brand-purple border-2 border-brand-purple-lighter hover:bg-brand-purple-lighter/30 shadow-soft hover:shadow-soft-lg',
    warm: 'bg-gradient-to-r from-brand-warm to-brand-warm-light hover:from-brand-warm-light hover:to-brand-warm shadow-warm',
  };

  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 font-semibold text-base text-white transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:ring-offset-2",
        variants[variant],
        variant === 'secondary' && 'text-brand-purple',
        className
      )}
      aria-label={`Navigate to ${to}`}
    >
      {children}
      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
};

export default CtaButton;
