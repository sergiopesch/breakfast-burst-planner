
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

const NavLink = ({ to, children, className = "", activeClassName = "bg-purple-100 text-purple-700" }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded-md transition-colors",
        isActive ? activeClassName : "hover:bg-gray-100",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
