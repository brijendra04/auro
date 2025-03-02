import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Edit, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark,
  Tag,
  Plus,
  X,
  Check
} from 'lucide-react';

import { RootState } from '../store';
import { 
  updateDraftPost, 
  createPost, 
  toggleLike, 
  toggleBookmark 
} from '../store/slices/contentSlice';

const ContentSharing: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, draftPost } = useSelector((state: RootState) => state.content);
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize draft post if it doesn't exist and we're in editing mode
  React.useEffect(() => {
    if (isEditing && !draftPost) {
      dispatch(updateDraftPost({
        title: '',
        body: '',
        tags: [],
      }));
    }
  }, [dispatch, draftPost, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateDraftPost({ [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && draftPost?.tags && !draftPost.tags.includes(newTag.trim())) {
      dispatch(updateDraftPost({ 
        tags: [...(draftPost.tags || []), newTag.trim()] 
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (draftPost?.tags) {
      dispatch(updateDraftPost({
        tags: draftPost.tags.filter(t => t !== tag)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!draftPost?.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!draftPost?.body?.trim()) {
      newErrors.body = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && draftPost && currentUser) {
      const now = new Date().toISOString();
      
      const newPost = {
        id: `post-${Date.now()}`,
        title: draftPost.title || '',
        body: draftPost.body || '',
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        createdAt: now,
        updatedAt: now,
        tags: draftPost.tags || [],
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarks: 0,
        isLiked: false,
        isBookmarked: false,
      };
      
      dispatch(createPost(newPost));
      setIsEditing(false);
    }
  };

  const handleToggleLike = (postId: string) => {
    dispatch(toggleLike(postId));
  };

  const handleToggleBookmark = (postId: string) => {
    dispatch(toggleBookmark(postId));
  };

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
            Content Sharing
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary flex items-center"
            >
              <Edit className="h-5 w-5 mr-2" />
              Create Post
            </button>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Share your knowledge and insights with the community
        </p>
      </div>
      
      {isEditing ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {draftPost?.title ? 'Edit Post' : 'Create New Post'}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`btn ${previewMode ? 'btn-primary' : 'btn-outline'} flex items-center`}
              >
                {previewMode ? <Edit className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {previewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
          
          {!previewMode ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={draftPost?.title || ''}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title..."
                  className={`input w-full ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content* (Markdown supported)
                </label>
                <textarea
                  id="body"
                  name="body"
                  value={draftPost?.body || ''}
                  onChange={handleInputChange}
                  rows={12}
                  placeholder="Write your content here... Markdown is supported."
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
                  {draftPost?.tags && draftPost.tags.map((tag, index) => (
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
                  {(!draftPost?.tags || draftPost.tags.length === 0) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No tags added</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary flex items-center"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Publish Post
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {draftPost?.title || 'Post Title'}
              </h1>
              
              <div className="prose dark:prose-invert max-w-none mb-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {draftPost?.body || 'Post content will appear here...'}
                </ReactMarkdown>
              </div>
              
              {draftPost?.tags && draftPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {draftPost.tags.map((tag, index) => (
                    <div 
                      key={index}
                      className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-xs"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setPreviewMode(false)}
                  className="btn btn-primary flex items-center"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Continue Editing
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                variants={itemVariants}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {post.author.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {post.title}
                  </h2>
                  
                  <div className="prose dark:prose-invert max-w-none mb-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.body}
                    </ReactMarkdown>
                  </div>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <div 
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-xs"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center text-sm ${
                        post.isLiked 
                          ? 'text-red-500 dark:text-red-400' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                      }`}
                    >
                      <Heart className={`h-5 w-5 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    
                    <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      <MessageSquare className="h-5 w-5 mr-1" />
                      <span>{post.comments}</span>
                    </button>
                    
                    <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      <Share2 className="h-5 w-5 mr-1" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleToggleBookmark(post.id)}
                    className={`flex items-center text-sm ${
                      post.isBookmarked 
                        ? 'text-primary-500 dark:text-primary-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 mr-1 ${post.isBookmarked ? 'fill-current' : ''}`} />
                    <span>{post.bookmarks}</span>
                  </button>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No posts available. Be the first to share content!
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary flex items-center mx-auto"
              >
                <Edit className="h-5 w-5 mr-2" />
                Create Post
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ContentSharing;