import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

type ActionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
  color: string;
};

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  link, 
  color 
}) => {
  return (
    <Link to={link}>
      <motion.div 
        className={`${color} rounded-xl p-6 h-full transition-all duration-200 hover:shadow-md`}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col h-full">
          <div className="mb-4">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
            {description}
          </p>
          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white mt-auto">
            Get started <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ActionCard;