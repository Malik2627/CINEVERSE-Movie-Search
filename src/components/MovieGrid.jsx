import React from 'react';
import MovieCard from './MovieCard';
import SkeletonLoader from './SkeletonLoader';
import { Film, AlertCircle, AlertTriangle, Key, Loader2, Sparkles } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';

export default function MovieGrid({
  movies = [],
  loading = false,
  title,
  subtitle,
  error = null,
  onRetry = null,
  onLoadMore = null,
  loadingMore = false,
  hasMore = false,
  emptyIcon: EmptyIcon = AlertCircle,
  emptyTitle = 'No Movies Found',
  emptyMessage,
  emptyActionText = 'Reset Filters',
  onEmptyAction,
}) {
  const { searchQuery, setSearchQuery, setSelectedGenre, setIsApiKeyModalOpen } = useMovieContext();

  const handleDefaultReset = () => {
    setSearchQuery('');
    setSelectedGenre('all');
  };

  const finalEmptyAction = onEmptyAction || handleDefaultReset;

  return (
    <section className="movies-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Film size={22} color="var(--accent-purple)" />
            <span>{title}</span>
          </h2>
          {subtitle && <p className="section-subtitle-text">{subtitle}</p>}
        </div>

        {!loading && !error && movies.length > 0 && (
          <span className="section-count-badge">
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
          </span>
        )}
      </div>

      {/* Grid or Skeletons or Empty/Error State */}
      <div className="movie-grid">
        {loading ? (
          <SkeletonLoader count={12} />
        ) : error ? (
          <div className="grid-error-card">
            <AlertTriangle size={44} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
            <h3 className="grid-error-title">TMDB API Notice</h3>
            <p className="grid-error-desc">
              {error.message || 'Unable to load titles from TMDB.'}
            </p>
            <div className="grid-error-actions">
              <button className="btn-primary" onClick={() => setIsApiKeyModalOpen(true)}>
                <Key size={16} /> Configure API Key
              </button>
              {onRetry && (
                <button className="btn-secondary" onClick={onRetry}>
                  Retry Request
                </button>
              )}
            </div>
          </div>
        ) : movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <div className="grid-empty-card">
            <EmptyIcon size={48} color="var(--accent-blue)" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
            <h3 className="grid-empty-title">{emptyTitle}</h3>
            <p className="grid-empty-desc">
              {emptyMessage ||
                (searchQuery
                  ? `No movies matched your search query "${searchQuery}". Try a different title or keyword.`
                  : 'No movies match your active filter criteria.')}
            </p>
            <button className="btn-primary" onClick={finalEmptyAction}>
              {emptyActionText}
            </button>
          </div>
        )}
      </div>

      {/* Load More Pagination Container */}
      {!loading && !error && movies.length > 0 && hasMore && onLoadMore && (
        <div className="pagination-load-more-wrap">
          <button
            className="btn-load-more"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Loading More Movies...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Load More Movies</span>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
