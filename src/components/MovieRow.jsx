import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import SkeletonLoader from './SkeletonLoader';

export default function MovieRow({ title, icon: Icon, movies = [], loading = false, subtitle }) {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies]);

  const handleScroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="movie-row-section">
      <div className="row-header">
        <div className="row-title-wrap">
          {Icon && (
            <div className="row-icon-badge">
              <Icon size={18} />
            </div>
          )}
          <div>
            <h2 className="row-title">{title}</h2>
            {subtitle && <p className="row-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="row-nav-arrows">
          <button
            className={`row-arrow-btn ${!showLeftArrow ? 'disabled' : ''}`}
            onClick={() => handleScroll('left')}
            disabled={!showLeftArrow}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`row-arrow-btn ${!showRightArrow ? 'disabled' : ''}`}
            onClick={() => handleScroll('right')}
            disabled={!showRightArrow}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="row-carousel-container">
        <div
          className="row-cards-slider"
          ref={rowRef}
          onScroll={checkScroll}
        >
          {loading ? (
            <div className="row-skeleton-wrap">
              <SkeletonLoader count={6} />
            </div>
          ) : movies && movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="row-card-item">
                <MovieCard movie={movie} />
              </div>
            ))
          ) : (
            <div className="row-empty">No movies currently available in this section.</div>
          )}
        </div>
      </div>
    </section>
  );
}

