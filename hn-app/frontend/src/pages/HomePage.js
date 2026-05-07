import React, { useState, useEffect, useCallback } from 'react';
import { storiesAPI, scraperAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';
import './Pages.css';

const HomePage = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [page, setPage] = useState(1);

  const fetchStories = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await storiesAPI.getAll(p, 10);
      setStories(data.stories);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories(page);
  }, [page, fetchStories]);

  const handleScrape = async () => {
    setScraping(true);
    try {
      const { data } = await scraperAPI.trigger();
      toast.success(`Scraped ${data.count} stories!`);
      fetchStories(1);
      setPage(1);
    } catch {
      toast.error('Scraping failed');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <span className="title-accent">Top</span> Stories
            </h1>
            <p className="page-subtitle">
              Hacker News · sorted by points
              {pagination && <span className="total-badge">{pagination.total} total</span>}
            </p>
          </div>
          <button
            className={`scrape-btn ${scraping ? 'loading' : ''}`}
            onClick={handleScrape}
            disabled={scraping}
          >
            {scraping ? '⟳ Scraping...' : '⟳ Refresh'}
          </button>
        </div>

        <div className="stories-list">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))
          ) : stories.length === 0 ? (
            <div className="empty-state">
              <p>No stories found. Click Refresh to scrape Hacker News.</p>
            </div>
          ) : (
            stories.map((story, i) => (
              <StoryCard
                key={story._id}
                story={story}
                rank={(page - 1) * 10 + i + 1}
              />
            ))
          )}
        </div>

        {pagination && !loading && (
          <Pagination
            pagination={pagination}
            onPageChange={(p) => { setPage(p); window.scrollTo(0, 0); }}
          />
        )}

        {!user && (
          <div className="auth-cta">
            <span>🔖 Login to bookmark your favorite stories</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
