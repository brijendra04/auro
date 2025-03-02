import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export type Content = {
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
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  isLiked: boolean;
  isBookmarked: boolean;
};

type ContentState = {
  posts: Content[];
  currentPost: Content | null;
  draftPost: Partial<Content> | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ContentState = {
  posts: [
    {
      id: 'post-1',
      title: 'Getting Started with Community Engagement',
      body: '# Welcome to our Community\n\nThis is a guide to help you get started with our platform. Here are some tips:\n\n- Complete your profile\n- Join discussions\n- Create polls\n- Share your knowledge\n\n## Why Engagement Matters\n\nCommunity engagement helps build stronger connections and fosters knowledge sharing.',
      author: {
        id: 'user-1',
        name: 'Jane Cooper',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      createdAt: '2023-04-15T10:30:00Z',
      updatedAt: '2023-04-15T10:30:00Z',
      tags: ['getting-started', 'guide', 'community'],
      likes: 42,
      comments: 12,
      shares: 8,
      bookmarks: 15,
      isLiked: false,
      isBookmarked: false,
    },
  ],
  currentPost: null,
  draftPost: null,
  status: 'idle',
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'content/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('/api/posts');
      // return response.data;
      
      // For demo purposes, we'll just return the mock data
      return initialState.posts;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    updateDraftPost: (state, action: PayloadAction<Partial<Content>>) => {
      state.draftPost = { ...state.draftPost, ...action.payload };
    },
    resetDraftPost: (state) => {
      state.draftPost = null;
    },
    createPost: (state, action: PayloadAction<Content>) => {
      state.posts.unshift(action.payload);
      state.draftPost = null;
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
      }
    },
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.isBookmarked = !post.isBookmarked;
        post.bookmarks += post.isBookmarked ? 1 : -1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  updateDraftPost,
  resetDraftPost,
  createPost,
  toggleLike,
  toggleBookmark,
} = contentSlice.actions;

export default contentSlice.reducer;