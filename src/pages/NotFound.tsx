import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, HelpCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <div className="absolute">
        <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
          <HelpCircle className="h-24 w-24 text-primary-500" />
        </div>
      </div>
      <div className="mt-32">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Link to="/" className="btn btn-primary flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <Link to="/qa" className="btn btn-outline flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Questions
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;