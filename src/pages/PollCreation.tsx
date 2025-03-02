import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Tag,
  Check,
  X
} from 'lucide-react';

import { 
  updateDraftPoll, 
  addPollOption, 
  removePollOption, 
  reorderPollOptions,
  createPoll
} from '../store/slices/pollsSlice';
import { RootState } from '../store';

const PollCreation: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { draftPoll } = useSelector((state: RootState) => state.polls);
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [step, setStep] = useState(1);
  const [newOption, setNewOption] = useState('');
  const [newTag, setNewTag] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize draft poll if it doesn't exist
  React.useEffect(() => {
    if (!draftPoll) {
      dispatch(updateDraftPoll({
        title: '',
        description: '',
        options: [],
        tags: [],
      }));
    }
  }, [dispatch, draftPoll]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateDraftPoll({ [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      dispatch(addPollOption({ text: newOption.trim() }));
      setNewOption('');
      
      // Clear error when user adds an option
      if (errors.options) {
        setErrors(prev => ({ ...prev, options: '' }));
      }
    }
  };

  const handleRemoveOption = (optionId: string) => {
    dispatch(removePollOption(optionId));
  };

  const handleReorderOptions = (newOrder: string[]) => {
    dispatch(reorderPollOptions(newOrder));
  };

  const handleAddTag = () => {
    if (newTag.trim() && draftPoll?.tags && !draftPoll.tags.includes(newTag.trim())) {
      dispatch(updateDraftPoll({ 
        tags: [...(draftPoll.tags || []), newTag.trim()] 
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (draftPoll?.tags) {
      dispatch(updateDraftPoll({
        tags: draftPoll.tags.filter(t => t !== tag)
      }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!draftPoll?.title?.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!draftPoll?.description?.trim()) {
        newErrors.description = 'Description is required';
      }
    } else if (currentStep === 2) {
      if (!draftPoll?.options || draftPoll.options.length < 2) {
        newErrors.options = 'At least 2 options are required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep(step) && draftPoll && currentUser) {
      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(now.getDate() + expiryDays);
      
      const newPoll = {
        id: `poll-${Date.now()}`,
        title: draftPoll.title || '',
        description: draftPoll.description || '',
        options: draftPoll.options || [],
        createdBy: currentUser.id,
        createdAt: now.toISOString(),
        expiresAt: expiryDate.toISOString(),
        tags: draftPoll.tags || [],
        totalVotes: 0,
        isActive: true,
      };
      
      dispatch(createPoll(newPoll));
      navigate('/');
    }
  };

  if (!draftPoll) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Create a New Poll
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Engage your community with an interactive poll. Follow the steps below to create your poll.
        </p>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              1
            </div>
            <div className={`ml-2 text-sm font-medium ${
              step >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Basic Info
            </div>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${
            step >= 2 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              2
            </div>
            <div className={`ml-2 text-sm font-medium ${
              step >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Poll Options
            </div>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${
            step >= 3 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              3
            </div>
            <div className={`ml-2 text-sm font-medium ${
              step >= 3 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Settings
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Poll Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={draftPoll.title || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., What feature should we prioritize next?"
                    className={`input w-full ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={draftPoll.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Provide context for your poll..."
                    className={`input w-full ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Poll Options*
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Add at least 2 options. Drag to reorder.
                  </p>
                  
                  <div className="flex items-center mb-3">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add a new option..."
                      className="input flex-1 mr-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOption();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddOption}
                      className="btn btn-primary"
                      disabled={!newOption.trim()}
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {errors.options && (
                    <p className="mt-1 text-sm text-red-500 mb-3">{errors.options}</p>
                  )}
                  
                  {draftPoll.options && draftPoll.options.length > 0 ? (
                    <Reorder.Group
                      axis="y"
                      values={draftPoll.options.map(option => option.id)}
                      onReorder={handleReorderOptions}
                      className="space-y-2"
                    >
                      {draftPoll.options.map((option) => (
                        <Reorder.Item
                          key={option.id}
                          value={option.id}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center cursor-move"
                        >
                          <GripVertical className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="flex-1 text-gray-800 dark:text-gray-200">{option.text}</span>
                          <button
                            onClick={() => handleRemoveOption(option.id)}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                            aria-label="Remove option"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400">No options added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Poll Duration
                  </label>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <select
                      value={expiryDays}
                      onChange={(e) => setExpiryDays(Number(e.target.value))}
                      className="input"
                    >
                      <option value={1}>1 day</option>
                      <option value={3}>3 days</option>
                      <option value={7}>1 week</option>
                      <option value={14}>2 weeks</option>
                      <option value={30}>1 month</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Add tags to help categorize your poll
                  </p>
                  
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
                    {draftPoll.tags && draftPoll.tags.map((tag, index) => (
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
                    {(!draftPoll.tags || draftPoll.tags.length === 0) && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No tags added</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Preview
        </h2>
        
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {draftPoll.title || 'Poll Title'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {draftPoll.description || 'Poll description will appear here...'}
          </p>
          
          <div className="space-y-3 mb-4">
            {draftPoll.options && draftPoll.options.length > 0 ? (
              draftPoll.options.map((option, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-700 rounded-lg p-3 flex items-center"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center mr-3 flex-shrink-0">
                    {index === 0 && <Check className="h-4 w-4 text-primary-500" />}
                  </div>
                  <span className="text-gray-800 dark:text-gray-200">{option.text}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Options will appear here...
              </p>
            )}
          </div>
          
          {draftPoll.tags && draftPoll.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {draftPoll.tags.map((tag, index) => (
                <div 
                  key={index}
                  className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-xs"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevStep}
          className="btn btn-outline flex items-center"
          disabled={step === 1}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Previous
        </button>
        
        {step < 3 ? (
          <button
            onClick={handleNextStep}
            className="btn btn-primary flex items-center"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="btn btn-primary flex items-center"
          >
            Create Poll
            <Check className="h-5 w-5 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PollCreation;

// export default PollCreation