import React from 'react';
import { X, Trash2, Bookmark, Film } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { getPosterUrl } from '../services/tmdb.js';

export default function WatchlistDrawer() {
  const {
    watchlist,
    removeFromWatchlist,
    isWatchlistOpen,
    setIsWatchlistOpen,
    setSelectedMovie,
  } = useMovieContext();

  if (!isWatchlistOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setIsWatchlistOpen(false)} />
      <div className="watchlist-drawer">
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bookmark size={20} color="var(--accent-purple)" />
            <h2 style={{ fontSize: '1.25rem' }}>My Watchlist</h2>
            <span className="badge-count">{watchlist.length}</span>
          </div>
          <button
            className="clear-search-btn"
            onClick={() => setIsWatchlistOpen(false)}
            title="Close"
          >
            <X size={22} />
          </button>
        </div>

        <div className="drawer-items-list">
          {watchlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <Film size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Your Watchlist is empty</p>
              <p style={{ fontSize: '0.85rem' }}>
                Bookmark movies with the bookmark icon on any card to save them here.
              </p>
            </div>
          ) : (
            watchlist.map((movie) => {
              const posterUrl = getPosterUrl(movie.poster_path, 'w342');
              const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';

              return (
                <div
                  key={movie.id}
                  className="watchlist-item"
                  onClick={() => {
                    setSelectedMovie(movie);
                    setIsWatchlistOpen(false);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="watchlist-thumb"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                  <div className="watchlist-item-info">
                    <h4 className="watchlist-item-title">{movie.title}</h4>
                    <p className="watchlist-item-meta">
                      ⭐ {Number(movie.vote_average || 0).toFixed(1)} {releaseYear ? `• ${releaseYear}` : ''}
                    </p>
                  </div>
                  <button
                    className="clear-search-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(movie.id);
                    }}
                    title="Remove from watchlist"
                    style={{ padding: '0.5rem' }}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
