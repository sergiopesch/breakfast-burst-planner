
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RecipeFormButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  className?: string;
}

const RecipeFormButton = ({ variant = "default", className = "" }: RecipeFormButtonProps) => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => navigate('/create-recipe')}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add New Recipe
    </Button>
  );
};

export default RecipeFormButton;
