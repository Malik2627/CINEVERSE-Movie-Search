import React from 'react';
import { Play, Info, Star, Plus, Check, Compass, Calendar, Sparkles } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { getBackdropUrl } from '../services/tmdb.js';

const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export default function HeroBanner({ movie, onExplore }) {
  const { setSelectedMovie, addToWatchlist, removeFromWatchlist, isWatchlisted } = useMovieContext();

  if (!movie) return null;

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const inWatchlist = isWatchlisted(movie.id);

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleScrollToExplore = () => {
    if (onExplore) {
      onExplore();
    } else {
      const target = document.getElementById('cineverse-content-start');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '2024';
  const rating = Number(movie.vote_average || 0).toFixed(1);

  // Get genre labels
  const genres = movie.genres
    ? movie.genres.map((g) => g.name)
    : movie.genre_ids
    ? movie.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 3)
    : [];

  return (
    <section className="hero-banner">
      <div
        className="hero-backdrop"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />
      <div className="hero-gradient-overlay" />
      <div className="hero-vignette" />

      <div className="hero-content">
        <div className="hero-badge-row">
          <span className="hero-badge">
            <Sparkles size={13} />
            <span>Featured Premiere</span>
          </span>

          {genres.map((genre) => (
            <span key={genre} className="hero-genre-pill">
              {genre}
            </span>
          ))}
        </div>

        <h1 className="hero-title">{movie.title}</h1>

        <div className="hero-meta">
          <div className="hero-rating">
            <Star size={18} fill="#fbbf24" strokeWidth={0} />
            <span>{rating} Rating</span>
          </div>
          <span className="meta-dot">•</span>
          <div className="hero-meta-item">
            <Calendar size={16} />
            <span>{releaseYear}</span>
          </div>
          {movie.runtime && (
            <>
              <span className="meta-dot">•</span>
              <span>{movie.runtime} min</span>
            </>
          )}
        </div>

        <p className="hero-overview">{movie.overview}</p>

        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => setSelectedMovie(movie)}
          >
            <Play size={18} fill="currentColor" />
            <span>Watch Trailer</span>
          </button>

          <button
            className="btn-secondary"
            onClick={handleScrollToExplore}
          >
            <Compass size={18} />
            <span>Explore Movies</span>
          </button>

          <button
            className={`btn-secondary ${inWatchlist ? 'active-watchlist' : ''}`}
            onClick={handleWatchlistToggle}
          >
            {inWatchlist ? <Check size={18} color="#10b981" /> : <Plus size={18} />}
            <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>

          <button
            className="btn-glass-icon"
            onClick={() => setSelectedMovie(movie)}
            title="More Details"
            aria-label="More Details"
          >
            <Info size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}
