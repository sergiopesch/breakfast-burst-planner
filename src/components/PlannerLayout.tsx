
import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft } from "lucide-react";
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

  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  return (
    <div className={cn(
      "grid relative transition-all duration-500 ease-out-expo",
      isSidebarOpen ? "grid-cols-1 lg:grid-cols-[320px_1fr]" : "grid-cols-1",
      "gap-6 lg:gap-8",
      className
    )}>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed top-20 z-20 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 lg:hidden transition-all duration-300",
          isSidebarOpen ? "left-[288px]" : "left-4"
        )}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <AnimatePresence mode="sync">
        {isSidebarOpen && (
          <motion.div
            className="lg:static fixed inset-y-0 left-0 z-10 w-[320px] lg:w-full pt-16 lg:pt-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-auto mx-4 lg:mx-0 bg-card/95 backdrop-blur-xl border border-border/40 rounded-xl shadow-elegant">
              <div className="p-5 space-y-6">
                {sidebar}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn("transition-all duration-300 px-4 lg:px-0", "min-h-[80vh]")}>
        {/* Desktop sidebar toggle */}
        <div className="hidden lg:flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span className="text-sm">Hide sidebar</span>
              </>
            ) : (
              <>
                <PanelLeft className="h-4 w-4" />
                <span className="text-sm">Show sidebar</span>
              </>
            )}
          </Button>
        </div>
        {content}
      </div>
    </div>
  );
};

export default PlannerLayout;
