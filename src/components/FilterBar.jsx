import React, { useEffect, useState } from 'react';
import { useMovieContext } from '../context/MovieContext';
import { FALLBACK_GENRES } from '../utils/constants.js';
import { getMovieGenres } from '../services/tmdb.js';
import { SlidersHorizontal, ArrowUpDown, Flame, Star, Calendar } from 'lucide-react';

export default function FilterBar({ showSort = true }) {
  const {
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
  } = useMovieContext();

  const [genres, setGenres] = useState(FALLBACK_GENRES);

  useEffect(() => {
    let isMounted = true;
    getMovieGenres()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setGenres([{ id: 'all', name: 'All Genres' }, ...data]);
        }
      })
      .catch(() => {
        // Fallback genres remain active
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const sortOptions = [
    { id: 'popularity.desc', label: 'Popularity', icon: Flame },
    { id: 'vote_average.desc', label: 'Top Rated', icon: Star },
    { id: 'primary_release_date.desc', label: 'Release Date', icon: Calendar },
  ];

  return (
    <div className="filter-controls-container">
      {/* Top Bar: Genre Header & Sort Controls */}
      {showSort && (
        <div className="filter-sort-header">
          <div className="filter-title-label">
            <SlidersHorizontal size={16} color="var(--accent-blue)" />
            <span>Filter by Genre</span>
          </div>

          <div className="sort-buttons-group">
            <span className="sort-by-text">
              <ArrowUpDown size={14} /> Sort By:
            </span>
            {sortOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = sortBy === opt.id;
              return (
                <button
                  key={opt.id}
                  className={`sort-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSortBy(opt.id)}
                  title={`Sort by ${opt.label}`}
                >
                  <Icon size={13} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Genre Pills */}
      <div className="genres-pill-scrollable">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-pill ${selectedGenre === String(genre.id) || (selectedGenre === 'all' && genre.id === 'all') ? 'active' : ''}`}
            onClick={() => setSelectedGenre(String(genre.id))}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}
