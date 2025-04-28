
import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlannerLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
  className?: string;
}

const PlannerLayout: React.FC<PlannerLayoutProps> = ({ 
  sidebar, 
  content,
  className
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={cn(
      "grid relative",
      isSidebarOpen ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1",
      "gap-6",
      className
    )}>
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {sidebar}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "lg:col-span-3" : "lg:col-span-4"
        )}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        {content}
      </motion.div>
    </div>
  );
};

export default PlannerLayout;
