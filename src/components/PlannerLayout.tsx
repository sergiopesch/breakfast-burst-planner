
import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card } from "@/components/ui/card";

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
  
  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  return (
    <div className={cn(
      "grid relative transition-all duration-300",
      isSidebarOpen ? "grid-cols-1 lg:grid-cols-[340px_1fr]" : "grid-cols-1",
      "gap-4 md:gap-6",
      className
    )}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "fixed top-20 z-20 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border shadow-sm lg:hidden",
          isSidebarOpen ? "left-[300px]" : "left-4"
        )}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </Button>
      
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            className="lg:static fixed inset-y-0 left-0 z-10 w-[340px] lg:w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="sticky top-4 h-[calc(100vh-2rem)] overflow-auto mx-4 bg-white/95 backdrop-blur-sm shadow-md border border-purple-100">
              <div className="p-5 space-y-6">
                {sidebar}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={cn(
        "transition-all duration-300 px-4",
        "min-h-[80vh]"
      )}>
        <div className="flex items-center mb-6 justify-between">
          <Button
            variant="outline"
            size="sm"
            className="hidden lg:flex items-center gap-2 text-[#4F2D9E] border-[#4F2D9E] hover:bg-[#4F2D9E]/10"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          </Button>
        </div>
        {content}
      </div>
    </div>
  );
};

export default PlannerLayout;
