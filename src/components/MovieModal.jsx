import React, { useEffect, useState } from 'react';
import {
  X,
  Star,
  Clock,
  Calendar,
  Bookmark,
  Check,
  Film,
  Sparkles,
  Building2,
  Globe2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { getMovieDetails, getPosterUrl, getBackdropUrl, getProfileUrl } from '../services/tmdb.js';

export default function MovieModal() {
  const {
    selectedMovie,
    setSelectedMovie,
    addToWatchlist,
    removeFromWatchlist,
    isWatchlisted,
  } = useMovieContext();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedMovie) {
      setDetails(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getMovieDetails(selectedMovie.id)
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDetails(selectedMovie);
          setLoading(false);
        }
      });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedMovie(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMovie, setSelectedMovie]);

  if (!selectedMovie) return null;

  const currentMovie = details || selectedMovie;
  const inWatchlist = isWatchlisted(currentMovie.id);

  // Find official YouTube trailer
  const trailer = currentMovie.videos?.results?.find(
    (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
  );

  const backdropUrl = currentMovie.backdrop_path
    ? getBackdropUrl(currentMovie.backdrop_path, 'original')
    : null;
  const posterUrl = getPosterUrl(currentMovie.poster_path, 'w500');

  const releaseDate = currentMovie.release_date
    ? new Date(currentMovie.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  const rating = Number(currentMovie.vote_average || 0).toFixed(1);

  const formatCurrency = (val) => {
    if (!val || val === 0) return 'Not Disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const recommendations = (
    currentMovie.recommendations?.results?.length > 0
      ? currentMovie.recommendations.results
      : currentMovie.similar?.results || []
  ).slice(0, 6);

  return (
    <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => setSelectedMovie(null)}
          title="Close modal"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Video Player or Backdrop Image */}
        <div className="modal-banner">
          {trailer ? (
            <iframe
              className="modal-trailer-frame"
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&rel=0`}
              title={`${currentMovie.title} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : backdropUrl ? (
            <>
              <img
                src={backdropUrl}
                alt={currentMovie.title}
                className="modal-banner-img"
              />
              <div className="modal-banner-overlay" />
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#0a0f1d' }} />
          )}
        </div>

        {/* Modal Main Body */}
        <div className="modal-body">
          <div className="modal-header-info">
            <img
              src={posterUrl}
              alt={currentMovie.title}
              className="modal-poster"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
              }}
            />

            <div className="modal-titles">
              <h2 className="modal-movie-title">{currentMovie.title}</h2>
              {currentMovie.tagline && (
                <p className="modal-tagline">"{currentMovie.tagline}"</p>
              )}

              <div className="modal-stats-row">
                <span className="modal-stat-pill rating">
                  <Star size={15} fill="#fbbf24" strokeWidth={0} />
                  <strong>{rating}</strong> / 10 ({currentMovie.vote_count?.toLocaleString() || 0} votes)
                </span>
                <span className="modal-stat-pill">
                  <Calendar size={15} />
                  {releaseDate}
                </span>
                {currentMovie.runtime ? (
                  <span className="modal-stat-pill">
                    <Clock size={15} />
                    {currentMovie.runtime} min
                  </span>
                ) : null}
              </div>

              {/* Genre Pills */}
              {currentMovie.genres?.length > 0 && (
                <div className="modal-genres-row">
                  {currentMovie.genres.map((g) => (
                    <span key={g.id} className="modal-genre-tag">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="modal-actions-row">
            <button
              className={`btn-primary ${inWatchlist ? 'btn-active-watchlist' : ''}`}
              onClick={() => {
                if (inWatchlist) {
                  removeFromWatchlist(currentMovie.id);
                } else {
                  addToWatchlist(currentMovie);
                }
              }}
            >
              {inWatchlist ? <Check size={18} /> : <Bookmark size={18} />}
              <span>{inWatchlist ? 'Saved in Watchlist' : 'Add to Watchlist'}</span>
            </button>
          </div>

          {/* Overview */}
          <div className="modal-section-block">
            <h3 className="modal-subheading">Overview</h3>
            <p className="modal-overview-text">
              {currentMovie.overview || 'No synopsis is currently available for this title.'}
            </p>
          </div>

          {/* Production Information */}
          <div className="modal-section-block">
            <h3 className="modal-subheading">Production Information</h3>
            <div className="production-info-grid">
              {/* Companies */}
              <div className="prod-info-card">
                <div className="prod-info-icon">
                  <Building2 size={18} />
                </div>
                <div className="prod-info-details">
                  <span className="prod-label">Studios & Companies</span>
                  <span className="prod-value">
                    {currentMovie.production_companies?.length > 0
                      ? currentMovie.production_companies.map((c) => c.name).join(', ')
                      : 'Independent / Not specified'}
                  </span>
                </div>
              </div>

              {/* Countries */}
              <div className="prod-info-card">
                <div className="prod-info-icon">
                  <Globe2 size={18} />
                </div>
                <div className="prod-info-details">
                  <span className="prod-label">Production Countries</span>
                  <span className="prod-value">
                    {currentMovie.production_countries?.length > 0
                      ? currentMovie.production_countries.map((c) => c.name).join(', ')
                      : 'Not specified'}
                  </span>
                </div>
              </div>

              {/* Budget */}
              <div className="prod-info-card">
                <div className="prod-info-icon">
                  <DollarSign size={18} />
                </div>
                <div className="prod-info-details">
                  <span className="prod-label">Budget</span>
                  <span className="prod-value">{formatCurrency(currentMovie.budget)}</span>
                </div>
              </div>

              {/* Box Office Revenue */}
              <div className="prod-info-card">
                <div className="prod-info-icon">
                  <TrendingUp size={18} />
                </div>
                <div className="prod-info-details">
                  <span className="prod-label">Box Office Revenue</span>
                  <span className="prod-value">{formatCurrency(currentMovie.revenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cast Section */}
          {currentMovie.credits?.cast?.length > 0 && (
            <div className="modal-section-block">
              <h3 className="modal-subheading">
                <Film size={18} color="var(--accent-blue)" /> Top Billed Cast
              </h3>
              <div className="cast-grid">
                {currentMovie.credits.cast.slice(0, 6).map((actor) => (
                  <div key={actor.id} className="cast-card">
                    <img
                      src={getProfileUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      className="cast-photo"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                      }}
                    />
                    <p className="cast-name">{actor.name}</p>
                    <p className="cast-character">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="modal-section-block">
              <h3 className="modal-subheading">
                <Sparkles size={18} color="var(--accent-purple)" /> You Might Also Like
              </h3>
              <div className="modal-recs-grid">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="modal-rec-card"
                    onClick={() => {
                      setSelectedMovie(rec);
                      // Scroll modal to top
                      const card = document.querySelector('.modal-card');
                      if (card) card.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <img
                      src={getPosterUrl(rec.poster_path, 'w342')}
                      alt={rec.title}
                      className="modal-rec-thumb"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=342&q=80';
                      }}
                    />
                    <div className="modal-rec-meta">
                      <p className="modal-rec-title">{rec.title}</p>
                      <span className="modal-rec-rating">
                        ⭐ {Number(rec.vote_average || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TMDB Attribution in Modal */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Movie metadata, cast, and trailers provided by <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>TMDB</a>.</span>
            <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
