import React from 'react';
import { Star, Bookmark, Check, Play } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { getPosterUrl } from '../services/tmdb.js';

export default function MovieCard({ movie }) {
  const { setSelectedMovie, addToWatchlist, removeFromWatchlist, isWatchlisted } = useMovieContext();

  if (!movie) return null;

  const posterUrl = getPosterUrl(movie.poster_path, 'w500');
  const inWatchlist = isWatchlisted(movie.id);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const rating = Number(movie.vote_average || 0).toFixed(1);

  return (
    <div
      className="movie-card animate-fade-in"
      onClick={() => setSelectedMovie(movie)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedMovie(movie);
        }
      }}
      aria-label={`View details for ${movie.title}`}
    >
      <div className="card-poster-wrap">
        <img
          src={posterUrl}
          alt={movie.title || 'Movie Poster'}
          className="card-poster"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
          }}
        />

        {/* Hover Gradient Overlay & Quick Play Icon */}
        <div className="card-hover-overlay">
          <div className="card-play-pill">
            <Play size={16} fill="currentColor" />
            <span>Details</span>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="rating-badge">
          <Star size={13} fill="#fbbf24" strokeWidth={0} />
          <span>{rating}</span>
        </div>

        {/* Watchlist Toggle Button */}
        <button
          className={`watchlist-btn ${inWatchlist ? 'active' : ''}`}
          onClick={handleWatchlistClick}
          title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          aria-label={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          {inWatchlist ? <Check size={16} color="#10b981" /> : <Bookmark size={16} />}
        </button>
      </div>

      <div className="card-info">
        <h3 className="card-title" title={movie.title}>
          {movie.title}
        </h3>
        <div className="card-meta">
          <span className="card-year">{releaseYear}</span>
          <span className="card-type">Movie</span>
        </div>
      </div>
    </div>
  );
}
