import React from 'react';
import { Clapperboard, Heart } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';

export default function Footer() {
  const { setActiveCategory, setSearchQuery, setIsWatchlistOpen } = useMovieContext();

  const handleNav = (tab) => {
    setSearchQuery('');
    setActiveCategory(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="cine-footer">
      <div className="footer-container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <a href="#" className="brand-logo" onClick={() => handleNav('home')}>
              <div className="logo-icon-wrap">
                <Clapperboard size={22} />
              </div>
              <span className="gradient-text">CINEVERSE</span>
            </a>
            <p className="footer-tagline">
              Your gateway to cinematic excellence. Discover trending blockbusters, timeless classics, official trailers, and personalized watchlists in an immersive dark aesthetic.
            </p>
            <div className="footer-badges">
              <span className="tech-badge">React 18</span>
              <span className="tech-badge">Vite</span>
              <span className="tech-badge">TMDB API</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links-list">
              <li>
                <button onClick={() => handleNav('home')}>Home Showcase</button>
              </li>
              <li>
                <button onClick={() => handleNav('discover')}>Discover & Genres</button>
              </li>
              <li>
                <button onClick={() => handleNav('trending')}>Trending Now</button>
              </li>
              <li>
                <button onClick={() => handleNav('top_rated')}>Top Rated</button>
              </li>
              <li>
                <button onClick={() => setIsWatchlistOpen(true)}>My Watchlist</button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links-list">
              <li>
                <button onClick={() => handleNav('popular')}>Popular Releases</button>
              </li>
              <li>
                <button onClick={() => handleNav('upcoming')}>Upcoming in Theaters</button>
              </li>
              <li>
                <button onClick={() => handleNav('trending')}>Weekly Trending</button>
              </li>
            </ul>
          </div>

          {/* TMDB Attribution & Notice */}
          <div className="footer-col footer-tmdb-col">
            <h4 className="footer-heading">Attribution</h4>
            <p className="tmdb-description">
              Movie data, posters, casting, and official trailers are dynamically powered by The Movie Database (TMDB).
            </p>
            <div className="tmdb-credit-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    background: 'linear-gradient(90deg, #90cea1 0%, #01b4e4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '800',
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  THE MOVIE DB
                </span>
                <span className="tech-badge" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                  API v3
                </span>
              </div>
              <p className="tmdb-legal">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </p>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.3rem', display: 'inline-block' }}
              >
                Visit themoviedb.org ↗
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} CINEVERSE. All Rights Reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Crafted with <Heart size={14} color="#ec4899" fill="#ec4899" /> for cinema lovers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}

