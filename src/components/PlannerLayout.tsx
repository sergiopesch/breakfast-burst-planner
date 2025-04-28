
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

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
  return (
    <div className={cn(
      "grid grid-cols-1 lg:grid-cols-3 gap-6",
      className
    )}>
      <motion.div 
        className="lg:col-span-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {sidebar}
      </motion.div>
      
      <motion.div 
        className="lg:col-span-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {content}
      </motion.div>
    </div>
  );
};

export default PlannerLayout;
