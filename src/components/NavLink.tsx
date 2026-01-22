
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

const NavLink = ({ to, children, className = "", activeClassName = "bg-brand-purple-lighter/70 text-brand-purple" }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200",
        isActive
          ? activeClassName
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
