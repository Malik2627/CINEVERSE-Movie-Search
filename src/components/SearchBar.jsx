import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useMovieContext();
  const [internalInput, setInternalInput] = useState(searchQuery);

  useEffect(() => {
    setInternalInput(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(internalInput.trim());
  };

  const handleClear = () => {
    setInternalInput('');
    setSearchQuery('');
  };

  const handleChange = (e) => {
    setInternalInput(e.target.value);
    // Instant live search as user types
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-section-wrap">
      <form onSubmit={handleSubmit} className="search-input-box">
        <Search size={20} color="var(--accent-blue)" className="search-icon-decor" />
        <input
          id="cineverse-search-input"
          type="text"
          placeholder="Search by title, director, actor, or genre..."
          value={internalInput}
          onChange={handleChange}
          autoComplete="off"
        />

        {internalInput && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={handleClear}
            title="Clear search"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}

        <button type="submit" className="search-submit-btn">
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
