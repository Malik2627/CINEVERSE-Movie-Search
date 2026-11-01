import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiKey, setApiKey as saveKeyService } from '../services/tmdb.js';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('home');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKeyState] = useState(getApiKey());

  // Watchlist persisted in localStorage
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cineverse_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cineverse_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    if (!movie || !movie.id) return;
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [movie, ...prev];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isWatchlisted = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  const updateApiKey = (key) => {
    saveKeyService(key);
    setApiKeyState(key);
  };

  return (
    <MovieContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        selectedGenre,
        setSelectedGenre,
        sortBy,
        setSortBy,
        selectedMovie,
        setSelectedMovie,
        isWatchlistOpen,
        setIsWatchlistOpen,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isWatchlisted,
        apiKey,
        updateApiKey,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}
