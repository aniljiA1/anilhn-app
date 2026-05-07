import React, { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';
import toast from 'react-hot-toast';
import './Pages.css';

const BookmarksPage = () => {
  const { user, updateBookmarks } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const { data } = await authAPI.getMe();
      setBookmarks(data.user.bookmarks || []);
      updateBookmarks(data.user.bookmarks.map((s) => s._id));
    } catch {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkChange = (storyId, isNowBookmarked) => {
    if (!isNowBookmarked) {
      setBookmarks((prev) => prev.filter((s) => s._id !== storyId));
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <span className="title-accent">★</span> Bookmarks
            </h1>
            <p className="page-subtitle">
              @{user?.username}'s saved stories
              {!loading && <span className="total-badge">{bookmarks.length}</span>}
            </p>
          </div>
        </div>

        <div className="stories-list">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))
          ) : bookmarks.length === 0 ? (
            <div className="empty-state">
              <p>No bookmarks yet. ☆ star stories from the home page.</p>
            </div>
          ) : (
            bookmarks.map((story, i) => (
              <StoryCard
                key={story._id}
                story={story}
                rank={i + 1}
                onBookmarkChange={handleBookmarkChange}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;
