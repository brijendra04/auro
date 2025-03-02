import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PollCreation from './pages/PollCreation';
import ContentSharing from './pages/ContentSharing';
import QAModule from './pages/QAModule';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import { setTheme } from './store/slices/themeSlice';
import { RootState } from './store';

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.theme);

  // Set theme based on system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    dispatch(setTheme(prefersDark ? 'dark' : 'light'));
  }, [dispatch]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AnimatePresence mode="wait">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/polls/create" element={<PollCreation />} />
          <Route path="/content" element={<ContentSharing />} />
          <Route path="/qa" element={<QAModule />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AnimatePresence>
  );
}

export default App;