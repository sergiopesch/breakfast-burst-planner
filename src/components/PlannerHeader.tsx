
import React from 'react';
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

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
        <h1 className="text-3xl md:text-4xl font-medium mb-2 text-[#4F2D9E] flex items-center">
          <Coffee className="h-8 w-8 mr-3 text-[#4F2D9E]" />
          {title}
        </h1>
        <p className="text-gray-500">
          {subtitle}
        </p>
      </div>
      <Link to="/">
        <Button 
          variant="outline" 
          className="text-[#4F2D9E] border-[#4F2D9E] hover:bg-[#4F2D9E]/10"
        >
          <Home className="h-5 w-5 mr-2" />
          Back to Home
        </Button>
      </Link>
    </header>
  );
};

export default PlannerHeader;
