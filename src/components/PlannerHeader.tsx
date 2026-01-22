
import React from 'react';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlannerHeaderProps {
  title: string;
  subtitle: string;
}

const PlannerHeader: React.FC<PlannerHeaderProps> = ({
  title,
  subtitle
}) => {
  return (
    <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2 block">
          Plan your meals
        </span>
        <h1 className="text-2xl md:text-3xl font-medium text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {subtitle}
        </p>
      </div>
      <Link
        to="/"
        className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Back to Home
      </Link>
    </header>
  );
};

export default PlannerHeader;
