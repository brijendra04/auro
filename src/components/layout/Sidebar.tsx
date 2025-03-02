import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BarChart2, 
  FileText, 
  HelpCircle, 
  User, 
  ChevronRight,
  ChevronLeft,
  Settings,
  BookOpen,
  Users,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/polls/create', icon: <BarChart2 size={20} />, label: 'Polls' },
    { path: '/content', icon: <FileText size={20} />, label: 'Content' },
    { path: '/qa', icon: <HelpCircle size={20} />, label: 'Q&A' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const secondaryNavItems = [
    { path: '/trending', icon: <TrendingUp size={20} />, label: 'Trending' },
    { path: '/community', icon: <Users size={20} />, label: 'Community' },
    { path: '/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { path: '/resources', icon: <BookOpen size={20} />, label: 'Resources' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-sm z-40 hidden md:block transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 256 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full flex flex-col justify-between py-4">
          <div className="px-3 py-2">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="px-3 py-2">
            <div className="mb-2 px-3">
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${isCollapsed ? 'sr-only' : ''}`}>
                More
              </h3>
            </div>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="px-3 mt-auto">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              {!isCollapsed && <span className="ml-2 text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;