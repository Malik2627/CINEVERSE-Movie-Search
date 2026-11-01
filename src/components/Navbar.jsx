import React, { useState } from 'react';
import {
  Film,
  Bookmark,
  Search,
  Menu,
  X,
  Compass,
  Flame,
  Star,
  Home,
  Key,
} from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';

export default function Navbar() {
  const {
    activeCategory,
    setActiveCategory,
    setSearchQuery,
    watchlist,
    setIsWatchlistOpen,
    setIsApiKeyModalOpen,
    apiKey,
  } = useMovieContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setSearchQuery('');
    setActiveCategory(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    setMobileMenuOpen(false);
    const searchInput = document.getElementById('cineverse-search-input');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'top_rated', label: 'Top Rated', icon: Star },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* CINEVERSE Brand Logo */}
          <a
            href="#"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
          >
            <div className="logo-icon-wrap">
              <Film size={22} />
            </div>
            <span className="gradient-text">CINEVERSE</span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeCategory === item.id;
              const isWatchlist = item.id === 'watchlist';
              return (
                <li key={item.id}>
                  <button
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    {isWatchlist && watchlist.length > 0 && (
                      <span className="badge-count-pill">{watchlist.length}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right Action Controls */}
          <div className="nav-actions">
            {/* Search Icon Trigger */}
            <button
              className="icon-circle-btn"
              onClick={handleSearchClick}
              title="Search Movies"
              aria-label="Search Movies"
            >
              <Search size={19} />
            </button>

            {/* Quick Watchlist Drawer Trigger */}
            <button
              className="icon-circle-btn"
              onClick={() => setIsWatchlistOpen(true)}
              title="Open Watchlist Drawer"
              aria-label="Open Watchlist Drawer"
            >
              <Bookmark size={18} />
            </button>

            {/* TMDB API Status / Settings */}
            <button
              className="icon-circle-btn"
              onClick={() => setIsApiKeyModalOpen(true)}
              title={apiKey ? 'TMDB API Connected' : 'Demo API Mode'}
              aria-label="TMDB API Settings"
            >
              <Key size={18} color={apiKey ? '#10b981' : '#f59e0b'} />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-menu-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <div className="brand-logo">
                <div className="logo-icon-wrap" style={{ width: '36px', height: '36px' }}>
                  <Film size={18} />
                </div>
                <span className="gradient-text">CINEVERSE</span>
              </div>
              <button
                className="icon-circle-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-menu-links">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeCategory === item.id;
                const isWatchlist = item.id === 'watchlist';
                return (
                  <button
                    key={item.id}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {isWatchlist && watchlist.length > 0 && (
                      <span className="badge-count-pill">{watchlist.length}</span>
                    )}
                  </button>
                );
              })}

              <button
                className="mobile-nav-item"
                onClick={handleSearchClick}
              >
                <Search size={20} />
                <span>Search Movies</span>
              </button>

              <button
                className="mobile-nav-item"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsApiKeyModalOpen(true);
                }}
              >
                <Key size={20} color={apiKey ? '#10b981' : '#f59e0b'} />
                <span>{apiKey ? 'API Connected' : 'Configure API Key'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
