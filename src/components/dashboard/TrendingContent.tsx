import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  FileText, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Heart,
  Eye
} from 'lucide-react';

import { Poll } from '../../store/slices/pollsSlice';
import { Content } from '../../store/slices/contentSlice';
import { Question } from '../../store/slices/qaSlice';

type TrendingContentProps = {
  polls: Poll[];
  posts: Content[];
  questions: Question[];
};

const TrendingContent: React.FC<TrendingContentProps> = ({ 
  polls, 
  posts, 
  questions 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const currentRef = scrollRef.current;
    currentRef?.addEventListener('scroll', checkScrollButtons);
    window.addEventListener('resize', checkScrollButtons);
    
    return () => {
      currentRef?.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Combine all content types into a single array
  const allContent = [
    ...polls.map(poll => ({ 
      type: 'poll', 
      id: poll.id, 
      title: poll.title, 
      author: { name: 'Jane Cooper', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      stats: { votes: poll.totalVotes },
      createdAt: poll.createdAt,
    })),
    ...posts.map(post => ({ 
      type: 'post', 
      id: post.id, 
      title: post.title, 
      author: post.author,
      stats: { likes: post.likes, comments: post.comments },
      createdAt: post.createdAt,
    })),
    ...questions.map(question => ({ 
      type: 'question', 
      id: question.id, 
      title: question.title, 
      author: question.author,
      stats: { votes: question.votes, answers: question.answers, views: question.views },
      createdAt: question.createdAt,
    })),
  ];

  // Add more mock content for demonstration
  const mockContent = [
    {
      type: 'post',
      id: 'post-2',
      title: 'Best practices for community moderation',
      author: {
        name: 'Mark Wilson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      stats: { likes: 87, comments: 34 },
      createdAt: '2023-05-02T10:30:00Z',
    },
    {
      type: 'poll',
      id: 'poll-2',
      title: 'Which technology should we use for our next project?',
      author: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      stats: { votes: 156 },
      createdAt: '2023-05-03T14:45:00Z',
    },
    {
      type: 'question',
      id: 'question-2',
      title: 'What are the best strategies for increasing community engagement?',
      author: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      stats: { votes: 28, answers: 12, views: 342 },
      createdAt: '2023-05-01T09:20:00Z',
    },
    {
      type: 'post',
      id: 'post-3',
      title: 'How to write effective community guidelines',
      author: {
        name: 'Emily Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      stats: { likes: 64, comments: 18 },
      createdAt: '2023-04-28T16:15:00Z',
    },
    {
      type: 'question',
      id: 'question-3',
      title: 'How do you handle difficult community members?',
      author: {
        name: 'Michael Brown',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      stats: { votes: 42, answers: 8, views: 215 },
      createdAt: '2023-04-30T11:10:00Z',
    },
  ];

  const trendingContent = [...allContent, ...mockContent].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'poll':
        return <BarChart2 className="h-4 w-4 text-purple-500" />;
      case 'post':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'question':
        return <HelpCircle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'poll':
        return 'border-purple-200 dark:border-purple-800';
      case 'post':
        return 'border-blue-200 dark:border-blue-800';
      case 'question':
        return 'border-amber-200 dark:border-amber-800';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const getContentStats = (content: any) => {
    switch (content.type) {
      case 'poll':
        return (
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <BarChart2 className="h-4 w-4 mr-1" />
            <span>{content.stats.votes} votes</span>
          </div>
        );
      case 'post':
        return (
          <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-sm">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              <span>{content.stats.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{content.stats.comments}</span>
            </div>
          </div>
        );
      case 'question':
        return (
          <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-sm">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{content.stats.answers}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{content.stats.views}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-md ${
            canScrollLeft 
              ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' 
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      
      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-md ${
            canScrollRight 
              ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' 
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Content cards */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex space-x-4">
          {trendingContent.map((content, index) => (
            <motion.div
              key={`${content.type}-${content.id}`}
              className={`flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 ${getTypeColor(content.type)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-5">
                <div className="flex items-center mb-3">
                  {getTypeIcon(content.type)}
                  <span className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {content.type}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {content.title}
                </h3>
                
                <div className="flex items-center mb-4">
                  <img 
                    src={content.author.avatar} 
                    alt={content.author.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    {content.author.name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  {getContentStats(content)}
                  
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingContent;