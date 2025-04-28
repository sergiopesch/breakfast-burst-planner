
import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
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
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 z-20 rounded-full w-10 h-10 bg-white/80 backdrop-blur-sm border shadow-sm lg:hidden"
        style={{ left: isSidebarOpen ? '260px' : '20px' }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-5 w-5 text-[#4F2D9E]" />
      </Button>
      
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            className="lg:static fixed inset-y-0 left-0 z-10 bg-white/95 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none w-[280px] lg:w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sticky top-4 pt-16 lg:pt-0 h-screen overflow-auto px-4 pb-20">
              {sidebar}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={cn(
        "transition-all duration-300",
        "min-h-[80vh]"
      )}>
        <div className="flex items-center mb-4 justify-between">
          <Button
            variant="outline"
            size="sm"
            className="hidden lg:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
            {isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          </Button>
        </div>
        {content}
      </div>
    </div>
  );
};

export default PlannerLayout;
