import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export type Comment = {
  id: string;
  body: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  isLiked: boolean;
  parentId: string | null;
};

export type Question = {
  id: string;
  title: string;
  body: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  votes: number;
  userVote: -1 | 0 | 1;
  views: number;
  answers: number;
  isFollowing: boolean;
  comments: Comment[];
};

type QAState = {
  questions: Question[];
  currentQuestion: Question | null;
  draftQuestion: Partial<Question> | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: QAState = {
  questions: [
    {
      id: 'question-1',
      title: 'How do I create an effective poll?',
      body: 'I want to create a poll that gets high engagement. What are some best practices for creating polls that community members will want to participate in?',
      author: {
        id: 'user-2',
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      createdAt: '2023-05-05T08:15:00Z',
      updatedAt: '2023-05-05T08:15:00Z',
      tags: ['polls', 'engagement', 'best-practices'],
      votes: 15,
      userVote: 0,
      views: 124,
      answers: 3,
      isFollowing: false,
      comments: [
        {
          id: 'comment-1',
          body: 'Make sure your poll options are clear and distinct from each other.',
          author: {
            id: 'user-1',
            name: 'Jane Cooper',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          },
          createdAt: '2023-05-05T09:30:00Z',
          likes: 8,
          isLiked: false,
          parentId: null,
        },
      ],
    },
  ],
  currentQuestion: null,
  draftQuestion: null,
  status: 'idle',
  error: null,
};

export const fetchQuestions = createAsyncThunk(
  'qa/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('/api/questions');
      // return response.data;
      
      // For demo purposes, we'll just return the mock data
      return initialState.questions;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const qaSlice = createSlice({
  name: 'qa',
  initialState,
  reducers: {
    updateDraftQuestion: (state, action: PayloadAction<Partial<Question>>) => {
      state.draftQuestion = { ...state.draftQuestion, ...action.payload };
    },
    resetDraftQuestion: (state) => {
      state.draftQuestion = null;
    },
    createQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.unshift(action.payload);
      state.draftQuestion = null;
    },
    voteQuestion: (state, action: PayloadAction<{ id: string; vote: -1 | 0 | 1 }>) => {
      const question = state.questions.find((q) => q.id === action.payload.id);
      if (question) {
        // Remove previous vote
        if (question.userVote !== 0) {
          question.votes -= question.userVote;
        }
        // Add new vote
        question.userVote = action.payload.vote;
        question.votes += action.payload.vote;
      }
    },
    toggleFollowQuestion: (state, action: PayloadAction<string>) => {
      const question = state.questions.find((q) => q.id === action.payload);
      if (question) {
        question.isFollowing = !question.isFollowing;
      }
    },
    addComment: (state, action: PayloadAction<{ questionId: string; comment: Comment }>) => {
      const question = state.questions.find((q) => q.id === action.payload.questionId);
      if (question) {
        question.comments.push(action.payload.comment);
        if (!action.payload.comment.parentId) {
          question.answers += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  updateDraftQuestion,
  resetDraftQuestion,
  createQuestion,
  voteQuestion,
  toggleFollowQuestion,
  addComment,
} = qaSlice.actions;

export default qaSlice.reducer;