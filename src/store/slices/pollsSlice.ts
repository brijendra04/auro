import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export type PollOption = {
  id: string;
  text: string;
  votes: number;
};

export type Poll = {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  tags: string[];
  totalVotes: number;
  isActive: boolean;
};

type PollsState = {
  polls: Poll[];
  currentPoll: Poll | null;
  draftPoll: Partial<Poll> | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: PollsState = {
  polls: [
    {
      id: 'poll-1',
      title: 'What feature should we prioritize next?',
      description: 'Help us decide which feature to focus on for our next development sprint.',
      options: [
        { id: 'option-1', text: 'Enhanced notification system', votes: 42 },
        { id: 'option-2', text: 'Dark mode support', votes: 78 },
        { id: 'option-3', text: 'Mobile app development', votes: 56 },
        { id: 'option-4', text: 'Integration with other platforms', votes: 34 },
      ],
      createdBy: 'user-1',
      createdAt: '2023-05-10T14:30:00Z',
      expiresAt: '2023-05-17T14:30:00Z',
      tags: ['development', 'feature-request', 'community'],
      totalVotes: 210,
      isActive: true,
    },
  ],
  currentPoll: null,
  draftPoll: null,
  status: 'idle',
  error: null,
};

export const fetchPolls = createAsyncThunk(
  'polls/fetchPolls',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('/api/polls');
      // return response.data;
      
      // For demo purposes, we'll just return the mock data
      return initialState.polls;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    updateDraftPoll: (state, action: PayloadAction<Partial<Poll>>) => {
      state.draftPoll = { ...state.draftPoll, ...action.payload };
    },
    addPollOption: (state, action: PayloadAction<Partial<PollOption>>) => {
      if (state.draftPoll) {
        const newOption = {
          id: `option-${Date.now()}`,
          text: action.payload.text || '',
          votes: 0,
        };
        state.draftPoll.options = [...(state.draftPoll.options || []), newOption];
      }
    },
    removePollOption: (state, action: PayloadAction<string>) => {
      if (state.draftPoll && state.draftPoll.options) {
        state.draftPoll.options = state.draftPoll.options.filter(
          (option) => option.id !== action.payload
        );
      }
    },
    reorderPollOptions: (state, action: PayloadAction<string[]>) => {
      if (state.draftPoll && state.draftPoll.options) {
        const optionMap = new Map(
          state.draftPoll.options.map((option) => [option.id, option])
        );
        state.draftPoll.options = action.payload
          .map((id) => optionMap.get(id))
          .filter((option): option is PollOption => option !== undefined);
      }
    },
    resetDraftPoll: (state) => {
      state.draftPoll = null;
    },
    createPoll: (state, action: PayloadAction<Poll>) => {
      state.polls.unshift(action.payload);
      state.draftPoll = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.polls = action.payload;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  updateDraftPoll,
  addPollOption,
  removePollOption,
  reorderPollOptions,
  resetDraftPoll,
  createPoll,
} = pollsSlice.actions;

export default pollsSlice.reducer;