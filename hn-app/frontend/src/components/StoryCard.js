import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storiesAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './StoryCard.css';

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return null;
  }
};

const StoryCard = ({ story, rank, onBookmarkChange }) => {
  const { user, isBookmarked, updateBookmarks } = useAuth();
  const [bookmarking, setBookmarking] = useState(false);
  const bookmarked = isBookmarked(story._id);
  const domain = getDomain(story.url);

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Login to bookmark stories');
      return;
    }
    setBookmarking(true);
    try {
      const { data } = await storiesAPI.toggleBookmark(story._id);
      updateBookmarks(data.bookmarks);
      toast.success(data.message);
      if (onBookmarkChange) onBookmarkChange(story._id, data.bookmarked);
    } catch {
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <div className={`story-card ${bookmarked ? 'bookmarked' : ''}`}>
      <div className="story-rank">{rank}</div>
      <div className="story-body">
        <div className="story-title-row">
          {story.url ? (
            <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-title">
              {story.title}
            </a>
          ) : (
            <Link to={`/stories/${story._id}`} className="story-title">
              {story.title}
            </Link>
          )}
          {domain && <span className="story-domain">({domain})</span>}
        </div>
        <div className="story-meta">
          <span className="meta-item points">▲ {story.points}</span>
          <span className="meta-sep">·</span>
          <span className="meta-item">by <strong>{story.author}</strong></span>
          <span className="meta-sep">·</span>
          <span className="meta-item time">{story.postedAt}</span>
          <span className="meta-sep">·</span>
          <Link to={`/stories/${story._id}`} className="meta-link">details</Link>
        </div>
      </div>
      <button
        className={`bookmark-btn ${bookmarked ? 'active' : ''} ${bookmarking ? 'loading' : ''}`}
        onClick={handleBookmark}
        title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        disabled={bookmarking}
      >
        {bookmarked ? '★' : '☆'}
      </button>
    </div>
  );
};

export default StoryCard;
