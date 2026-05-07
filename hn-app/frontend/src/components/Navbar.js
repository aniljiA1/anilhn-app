import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-y">Y</span>
          <span className="brand-text">HN Reader</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Stories
          </Link>
          {user && (
            <Link to="/bookmarks" className={`nav-link ${location.pathname === '/bookmarks' ? 'active' : ''}`}>
              Bookmarks
            </Link>
          )}
        </div>

        <div className="navbar-auth">
          {user ? (
            <>
              <span className="nav-username">@{user.username}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-ghost">Login</Link>
              <Link to="/register" className="btn-nav-solid">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
