
import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  return (
    <div className={cn(
      "grid relative transition-all duration-300",
      isSidebarOpen ? "grid-cols-1 lg:grid-cols-[280px_1fr]" : "grid-cols-1",
      "gap-4 md:gap-6",
      className
    )}>
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            className="lg:col-span-1 w-full"
            initial={{ opacity: 0, x: -20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "auto" }}
            exit={{ opacity: 0, x: -20, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sticky top-4">
              {sidebar}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "lg:col-span-1" : "lg:col-span-1"
        )}
        layout
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden lg:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft className="mr-2" /> : <ChevronRight className="mr-2" />}
            {isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          </Button>
        </div>
        {content}
      </motion.div>
    </div>
  );
};

export default PlannerLayout;
