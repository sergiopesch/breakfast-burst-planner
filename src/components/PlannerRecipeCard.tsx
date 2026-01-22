import React, { memo } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Recipe } from '@/hooks/useMealPlanner';
import ImageLoader from './ImageLoader';

interface PlannerRecipeCardProps {
  meal: Recipe;
  onToggleStatus: () => void;
  onRemove: () => void;
  className?: string;
}

const PlannerRecipeCard: React.FC<PlannerRecipeCardProps> = ({
  meal,
  onToggleStatus,
  onRemove,
  className
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <div className={cn(
        "group overflow-hidden rounded-xl border border-border/40 bg-card/50 transition-all duration-300 hover:shadow-elegant",
        meal.status === 'completed' && "bg-secondary/30"
      )}>
        <div className="flex items-center p-4 gap-4">
          {/* Image */}
          {meal.image && (
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
              <ImageLoader
                src={meal.image}
                alt={meal.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {meal.time && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{meal.time}</span>
                </div>
              )}
              {meal.status === 'completed' && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-brand-success/10 text-brand-success">
                  Done
                </span>
              )}
            </div>
            <h3 className={cn(
              "font-medium text-foreground truncate transition-colors",
              meal.status === 'completed' && "text-muted-foreground line-through"
            )}>
              {meal.title}
            </h3>
            {meal.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                {meal.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1" role="group" aria-label="Meal actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleStatus}
              aria-label={meal.status === 'completed' ? 'Mark as not completed' : 'Mark as completed'}
              aria-pressed={meal.status === 'completed'}
              className={cn(
                "h-8 w-8 rounded-full transition-colors",
                meal.status === 'completed'
                  ? "text-brand-success hover:bg-brand-success/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Check className={cn(
                "h-4 w-4",
                meal.status === 'completed' && "stroke-[2.5px]"
              )} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              aria-label={`Remove ${meal.title} from plan`}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(PlannerRecipeCard);
