import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  MessageSquare, 
  Eye, 
  Bell, 
  BellOff,
  Tag,
  Plus,
  X,
  Send,
  Code
} from 'lucide-react';

import { RootState } from '../store';
import { 
  updateDraftQuestion, 
  createQuestion, 
  voteQuestion, 
  toggleFollowQuestion,
  addComment
} from '../store/slices/qaSlice';

const QAModule: React.FC = () => {
  const dispatch = useDispatch();
  const { questions, draftQuestion } = useSelector((state: RootState) => state.qa);
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize draft question if it doesn't exist and we're in asking mode
  React.useEffect(() => {
    if (isAskingQuestion && !draftQuestion) {
      dispatch(updateDraftQuestion({
        title: '',
        body: '',
        tags: [],
      }));
    }
  }, [dispatch, draftQuestion, isAskingQuestion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateDraftQuestion({ [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && draftQuestion?.tags && !draftQuestion.tags.includes(newTag.trim())) {
      dispatch(updateDraftQuestion({ 
        tags: [...(draftQuestion.tags || []), newTag.trim()] 
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (draftQuestion?.tags) {
      dispatch(updateDraftQuestion({
        tags: draftQuestion.tags.filter(t => t !== tag)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!draftQuestion?.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!draftQuestion?.body?.trim()) {
      newErrors.body = 'Question details are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitQuestion = () => {
    if (validateForm() && draftQuestion && currentUser) {
      const now = new Date().toISOString();
      
      const newQuestion = {
        id: `question-${Date.now()}`,
        title: draftQuestion.title || '',
        body: draftQuestion.body || '',
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        createdAt: now,
        updatedAt: now,
        tags: draftQuestion.tags || [],
        votes: 0,
        userVote: 0,
        views: 0,
        answers: 0,
        isFollowing: false,
        comments: [],
      };
      
      dispatch(createQuestion(newQuestion));
      setIsAskingQuestion(false);
    }
  };

  const handleVote = (questionId: string, vote: -1 | 0 | 1) => {
    dispatch(voteQuestion({ id: questionId, vote }));
  };

  const handleToggleFollow = (questionId: string) => {
    dispatch(toggleFollowQuestion(questionId));
  };

  const handleToggleExpand = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const handleAddComment = (questionId: string) => {
    if (newComment.trim() && currentUser) {
      const comment = {
        id: `comment-${Date.now()}`,
        body: newComment,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        parentId: null,
      };
      
      dispatch(addComment({ questionId, comment }));
      setNewComment('');
    }
  };

  const filteredQuestions = questions.filter(question => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      question.title.toLowerCase().includes(query) ||
      question.body.toLowerCase().includes(query) ||
      question.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Questions & Answers
          </h1>
          {!isAskingQuestion && (
            <button
              onClick={() => setIsAskingQuestion(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ask Question
            </button>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Get answers from the community or share your knowledge
        </p>
      </div>
      
      {isAskingQuestion ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Ask a Question
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={draftQuestion?.title || ''}
                onChange={handleInputChange}
                placeholder="e.g., How do I implement authentication in my app?"
                className={` input w-full ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question Details* (Markdown supported)
              </label>
              <textarea
                id="body"
                name="body"
                value={draftQuestion?.body || ''}
                onChange={handleInputChange}
                rows={8}
                placeholder="Describe your question in detail. Include what you've tried and any specific issues you're facing."
                className={`input w-full font-mono ${errors.body ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              ></textarea>
              {errors.body && (
                <p className="mt-1 text-sm text-red-500">{errors.body}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex items-center mb-3">
                <Tag className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="input flex-1 mr-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  onClick={handleAddTag}
                  className="btn btn-outline"
                  disabled={!newTag.trim()}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {draftQuestion?.tags && draftQuestion.tags.map((tag, index) => (
                  <div 
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label="Remove tag"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {(!draftQuestion?.tags || draftQuestion.tags.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No tags added</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsAskingQuestion(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuestion}
                className="btn btn-primary flex items-center"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Post Question
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <motion.div
                  key={question.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                  variants={itemVariants}
                >
                  <div className="p-6">
                    <div className="flex">
                      <div className="flex flex-col items-center mr-6">
                        <button
                          onClick={() => handleVote(question.id, 1)}
                          className={`p-1 rounded ${
                            question.userVote === 1 
                              ? 'text-primary-600 dark:text-primary-400' 
                              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                          }`}
                          aria-label="Vote up"
                        >
                          <ChevronUp className="h-6 w-6" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white my-1">
                          {question.votes}
                        </span>
                        <button
                          onClick={() => handleVote(question.id, -1)}
                          className={`p-1 rounded ${
                            question.userVote === -1 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                          }`}
                          aria-label="Vote down"
                        >
                          <ChevronDown className="h-6 w-6" />
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <img 
                            src={question.author.avatar} 
                            alt={question.author.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                            {question.author.name}
                          </span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(question.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {question.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag, index) => (
                            <div 
                              key={index}
                              className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-xs"
                            >
                              {tag}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{question.answers} answers</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{question.views} views</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleToggleFollow(question.id)}
                            className={`flex items-center text-sm ${
                              question.isFollowing 
                                ? 'text-primary-600 dark:text-primary-400' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                            }`}
                          >
                            {question.isFollowing ? (
                              <>
                                <BellOff className="h-4 w-4 mr-1" />
                                <span>Unfollow</span>
                              </>
                            ) : (
                              <>
                                <Bell className="h-4 w-4 mr-1" />
                                <span>Follow</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleToggleExpand(question.id)}
                      className="mt-4 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center"
                    >
                      {expandedQuestion === question.id ? 'Hide details' : 'Show details'}
                    </button>
                    
                    {expandedQuestion === question.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4"
                      >
                        <div className="prose dark:prose-invert max-w-none mb-6">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {question.body}
                          </ReactMarkdown>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {question.comments.length} {question.comments.length === 1 ? 'Answer' : 'Answers'}
                          </h4>
                          
                          {question.comments.map((comment) => (
                            <div 
                              key={comment.id}
                              className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4"
                            >
                              <div className="flex items-center mb-2">
                                <img 
                                  src={comment.author.avatar} 
                                  alt={comment.author.name}
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                                  {comment.author.name}
                                </span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                              
                              <div className="prose dark:prose-invert max-w-none text-sm">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {comment.body}
                                </ReactMarkdown>
                              </div>
                            </div>
                          ))}
                          
                          <div className="mt-4">
                            <div className="flex items-center">
                              <img 
                                src={currentUser?.avatar} 
                                alt={currentUser?.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                              <div className="ml-3 flex-1">
                                <div className="relative">
                                  <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your answer..."
                                    rows={3}
                                    className="input w-full pr-10"
                                  ></textarea>
                                  <button
                                    onClick={() => handleAddComment(question.id)}
                                    disabled={!newComment.trim()}
                                    className="absolute right-2 bottom-2 p-1 text-primary-600 dark:text-primary-400 disabled:text-gray-400 disabled:dark:text-gray-600"
                                    aria-label="Send answer"
                                  >
                                    <Send className="h-5 w-5" />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Markdown is supported. Use <Code className="h-3 w-3 inline" /> for code blocks.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchQuery.trim() 
                    ? 'No questions found matching your search criteria.' 
                    : 'No questions available. Be the first to ask a question!'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsAskingQuestion(true);
                  }}
                  className="btn btn-primary flex items-center mx-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Ask Question
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default QAModule;