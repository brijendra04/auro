import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';
import pollsReducer from './slices/pollsSlice';
import contentReducer from './slices/contentSlice';
import qaReducer from './slices/qaSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    polls: pollsReducer,
    content: contentReducer,
    qa: qaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;