import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  FileText, 
  HelpCircle, 
  User, 
  TrendingUp, 
  ChevronRight,
  Award,
  Users,
  Clock
} from 'lucide-react';

import { RootState } from '../store';
import { fetchUserProfile } from '../store/slices/userSlice';
import { fetchPolls } from '../store/slices/pollsSlice';
import { fetchPosts } from '../store/slices/contentSlice';
import { fetchQuestions } from '../store/slices/qaSlice';

import TrendingContent from '../components/dashboard/TrendingContent';
import EngagementMetrics from '../components/dashboard/EngagementMetrics';
import ActionCard from '../components/dashboard/ActionCard';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { polls } = useSelector((state: RootState) => state.polls);
  const { posts } = useSelector((state: RootState) => state.content);
  const { questions } = useSelector((state: RootState) => state.qa);

  useEffect(() => {
    // In a real app, we would pass the actual user ID
    dispatch(fetchUserProfile('user-1') as any);
    dispatch(fetchPolls() as any);
    dispatch(fetchPosts() as any);
    dispatch(fetchQuestions() as any);
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const actionCards = [
    {
      title: 'Create Poll',
      description: 'Start a new poll to gather community feedback',
      icon: <BarChart2 className="h-8 w-8 text-primary-500" />,
      link: '/polls/create',
      color: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      title: 'Share Content',
      description: 'Write an article or share resources with the community',
      icon: <FileText className="h-8 w-8 text-secondary-500" />,
      link: '/content',
      color: 'bg-secondary-50 dark:bg-secondary-900/20',
    },
    {
      title: 'Ask Question',
      description: 'Get answers from the community experts',
      icon: <HelpCircle className="h-8 w-8 text-green-500" />,
      link: '/qa',
      color: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Update Profile',
      description: 'Enhance your profile to connect better',
      icon: <User className="h-8 w-8 text-amber-500" />,
      link: '/profile',
      color: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ];

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.section 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        variants={itemVariants}
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="h-16 w-16 rounded-full object-cover border-4 border-primary-100 dark:border-primary-900"
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {currentUser.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Engagement Score</p>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">92%</p>
              </div>
              
              <div className="text-center px-4 py-2 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Contributions</p>
                <p className="text-xl font-bold text-secondary-600 dark:text-secondary-400">
                  {currentUser.stats.posts + currentUser.stats.polls + currentUser.stats.questions + currentUser.stats.answers}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Member since {new Date(currentUser.joinDate).toLocaleDateString()}</span>
          </div>
          
          <Link 
            to="/profile" 
            className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center hover:underline"
          >
            View full profile <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </motion.section>

      {/* Action Cards */}
      <motion.section variants={itemVariants}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actionCards.map((card, index) => (
            <ActionCard 
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              link={card.link}
              color={card.color}
            />
          ))}
        </div>
      </motion.section>

      {/* Engagement Metrics */}
      <motion.section variants={itemVariants}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Engagement
        </h2>
        <EngagementMetrics stats={currentUser.stats} />
      </motion.section>

      {/* Trending Content */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Trending Now
          </h2>
          <Link 
            to="/trending" 
            className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center hover:underline"
          >
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <TrendingContent polls={polls} posts={posts} questions={questions} />
      </motion.section>

      {/* Community Highlights */}
      <motion.section 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Community Highlights
          </h2>
          <Link 
            to="/community" 
            className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center hover:underline"
          >
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Award className="h-6 w-6 text-amber-500" />
              <h3 className="ml-2 font-medium text-gray-900 dark:text-white">Top Contributor</h3>
            </div>
            <div className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Top Contributor" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">Tom Wilson</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">156 contributions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <TrendingUp className="h-6 w-6 text-primary-500" />
              <h3 className="ml-2 font-medium text-gray-900 dark:text-white">Trending Poll</h3>
            </div>
            <p className="font-medium text-gray-900 dark:text-white">What feature should we prioritize next?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">210 votes • 3 days left</p>
          </div>
          
          <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Users className="h-6 w-6 text-secondary-500" />
              <h3 className="ml-2 font-medium text-gray-900 dark:text-white">Active Members</h3>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              <img 
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" 
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt=""
              />
              <img 
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" 
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt=""
              />
              <img 
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt=""
              />
              <img 
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt=""
              />
              <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-800 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                +18
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">23 members online now</p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Dashboard;