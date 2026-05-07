import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookmarksPage from './pages/BookmarksPage';
import StoryDetailPage from './pages/StoryDetailPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/stories/:id" element={<StoryDetailPage />} />
      <Route
        path="/bookmarks"
        element={
          <ProtectedRoute>
            <BookmarksPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

const App = () => (
  <AuthProvider>
    <Router>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'toast-success',
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#e8e8e8',
            border: '1px solid #2e2e2e',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '13px',
          },
        }}
      />
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
