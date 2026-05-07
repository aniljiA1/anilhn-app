import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storiesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Pages.css';

const StoryDetailPage = () => {
  const { id } = useParams();
  const { user, isBookmarked, updateBookmarks } = useAuth();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await storiesAPI.getById(id);
        setStory(data.story);
      } catch {
        toast.error('Story not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleBookmark = async () => {
    if (!user) { toast.error('Login to bookmark stories'); return; }
    setBookmarking(true);
    try {
      const { data } = await storiesAPI.toggleBookmark(id);
      updateBookmarks(data.bookmarks);
      toast.success(data.message);
    } catch {
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarking(false);
    }
  };

  if (loading) return <div className="page"><div className="container"><div className="skeleton-card" style={{ height: 200 }} /></div></div>;
  if (!story) return <div className="page"><div className="container"><div className="empty-state"><p>Story not found. <Link to="/">Go home</Link></p></div></div></div>;

  const bookmarked = isBookmarked(story._id);

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="back-link">← Back to stories</Link>

        <div className="detail-card">
          <div className="detail-header">
            <h1 className="detail-title">{story.title}</h1>
            <button
              className={`bookmark-btn-large ${bookmarked ? 'active' : ''}`}
              onClick={handleBookmark}
              disabled={bookmarking}
            >
              {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
            </button>
          </div>

          <div className="detail-meta">
            <span className="detail-points">▲ {story.points} points</span>
            <span className="meta-sep">·</span>
            <span>by <strong>{story.author}</strong></span>
            <span className="meta-sep">·</span>
            <span className="detail-time">{story.postedAt}</span>
          </div>

          {story.url && (
            <a href={story.url} target="_blank" rel="noopener noreferrer" className="detail-url">
              🔗 {story.url}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;
