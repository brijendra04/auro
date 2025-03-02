import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Heart 
} from 'lucide-react';

type Stats = {
  posts: number;
  polls: number;
  questions: number;
  answers: number;
  likes: number;
};

type EngagementMetricsProps = {
  stats: Stats;
};

const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ stats }) => {
  const totalEngagement = stats.posts + stats.polls + stats.questions + stats.answers + stats.likes;
  
  const metrics = [
    {
      name: 'Posts',
      value: stats.posts,
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      percentage: Math.round((stats.posts / totalEngagement) * 100),
    },
    {
      name: 'Polls',
      value: stats.polls,
      icon: <BarChart2 className="h-5 w-5 text-purple-500" />,
      color: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      percentage: Math.round((stats.polls / totalEngagement) * 100),
    },
    {
      name: 'Questions',
      value: stats.questions,
      icon: <HelpCircle className="h-5 w-5 text-amber-500" />,
      color: 'bg-amber-100 dark:bg-amber-900/20',
      textColor: 'text-amber-700 dark:text-amber-300',
      percentage: Math.round((stats.questions / totalEngagement) * 100),
    },
    {
      name: 'Answers',
      value: stats.answers,
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      color: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      percentage: Math.round((stats.answers / totalEngagement) * 100),
    },
    {
      name: 'Likes',
      value: stats.likes,
      icon: <Heart className="h-5 w-5 text-red-500" />,
      color: 'bg-red-100 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      percentage: Math.round((stats.likes / totalEngagement) * 100),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className={`${metric.color} rounded-lg p-4`}>
            <div className="flex items-center mb-2">
              {metric.icon}
              <h3 className="ml-2 font-medium text-gray-900 dark:text-white">
                {metric.name}
              </h3>
            </div>
            <p className={`text-2xl font-bold ${metric.textColor}`}>
              {metric.value}
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div 
                  className={`h-2.5 rounded-full ${metric.textColor.replace('text', 'bg')}`}
                  style={{ width: '0%' }}
                  animate={{ width: `${metric.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                ></motion.div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {metric.percentage}% of total engagement
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngagementMetrics;