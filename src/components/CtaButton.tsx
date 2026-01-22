
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type CtaButtonProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

const CtaButton: React.FC<CtaButtonProps> = ({ to, children, className, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-foreground text-background hover:bg-foreground/90',
    secondary: 'bg-transparent text-foreground border border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5',
    ghost: 'bg-transparent text-foreground hover:bg-foreground/5',
  };

  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 font-medium text-sm transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2 focus:ring-offset-background",
        variants[variant],
        className
      )}
      aria-label={`Navigate to ${to}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
};

export default CtaButton;
