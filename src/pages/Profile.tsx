import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  FileText, 
  BarChart2, 
  HelpCircle, 
  MessageSquare, 
  Heart,
  Award,
  Settings
} from 'lucide-react';

import { RootState } from '../store';
import { updateUserProfile } from '../store/slices/userSlice';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });
  
  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        bio: currentUser.bio,
      });
    }
  }, [currentUser]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    if (currentUser) {
      dispatch(updateUserProfile(formData));
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        bio: currentUser.bio,
      });
    }
    setIsEditing(false);
  };
  
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
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
  
  const activityItems = [
    {
      id: 1,
      type: 'post',
      title: 'Getting Started with Community Engagement',
      date: '2 weeks ago',
      icon: <FileText className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 2,
      type: 'poll',
      title: 'What feature should we prioritize next?',
      date: '1 week ago',
      icon: <BarChart2 className="h-5 w-5 text-purple-500" />,
    },
    {
      id: 3,
      type: 'question',
      title: 'How do I create an effective poll?',
      date: '5 days ago',
      icon: <HelpCircle className="h-5 w-5 text-amber-500" />,
    },
    {
      id: 4,
      type: 'answer',
      title: 'Answered: Best practices for community moderation',
      date: '3 days ago',
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
    },
    {
      id: 5,
      type: 'like',
      title: 'Liked: How to write effective community guidelines',
      date: '1 day ago',
      icon: <Heart className="h-5 w-5 text-red-500" />,
    },
  ];
  
  const achievements = [
    {
      id: 1,
      title: 'First Post',
      description: 'Published your first content',
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      date: 'Apr 15, 2023',
    },
    {
      id: 2,
      title: 'Poll Master',
      description: 'Created 10+ polls with high engagement',
      icon: <BarChart2 className="h-6 w-6 text-purple-500" />,
      date: 'May 10, 2023',
    },
    {
      id: 3,
      title: 'Helpful Hand',
      description: 'Answered 20+ community questions',
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      date: 'Jun 5, 2023',
    },
  ];
  
  return (
    <motion.div
      className="max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8"
        variants={itemVariants}
      >
        <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
        <div className="px-6 sm:px-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-6">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
            />
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentUser.name}
                </h1>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 sm:mt-0 btn btn-outline flex items-center"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn btn-outline flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Member since {new Date(currentUser.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-4 pb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input flex-1"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input flex-1"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="input w-full"
                ></textarea>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Joined
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(currentUser.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bio
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {currentUser.bio}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          className="md:col-span-2 space-y-8"
          variants={itemVariants}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Activity
              </h2>
              <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                View all
              </a>
            </div>
            
            <div className="space-y-4">
              {activityItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="mr-4 mt-0.5">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white font-medium">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Achievements
            </h2>
            
            <div className="space-y-6">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="flex items-center"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white font-medium">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {achievement.date}
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center">
                  <Award className="h-4 w-4 mr-2" />
                  View all achievements
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="space-y-8"
          variants={itemVariants}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Stats
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Posts</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currentUser.stats.posts}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Polls</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currentUser.stats.polls}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-amber-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Questions</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currentUser.stats.questions}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Answers</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currentUser.stats.answers}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Likes</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currentUser.stats.likes}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Settings
            </h2>
            
            <div className="space-y-4">
              <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <Settings className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Account Settings</span>
              </a>
              
              <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <Bell className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Notification Preferences</span>
              </a>
              
              <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <Shield className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Privacy & Security</span>
              </a>
              
              <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <HelpCircle className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">Help & Support</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;