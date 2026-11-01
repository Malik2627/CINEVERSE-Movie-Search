import { API_BASE_URL, IMAGE_BASE_URL } from '../utils/constants.js';

/**
 * Safely resolves the active TMDB API Key from environment or local storage
 * Never logs or exposes the key value
 */
export const getApiKey = () => {
  const envKey =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TMDB_API_KEY) ||
    (typeof process !== 'undefined' && process.env && process.env.VITE_TMDB_API_KEY) ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('tmdb_api_key')) ||
    '';
  return envKey.trim();
};

export const setApiKey = (key) => {
  if (key) {
    localStorage.setItem('tmdb_api_key', key.trim());
  } else {
    localStorage.removeItem('tmdb_api_key');
  }
};

/**
 * Reusable image URL helpers for posters, backdrops, and profiles
 */
export const getPosterUrl = (path, size = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const getProfileUrl = (path, size = 'w185') => {
  if (!path) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}${size}${path}`;
};

/**
 * Centralized TMDB fetcher with robust error categorization
 */
async function tmdbFetch(endpoint, params = {}) {
  const apiKey = getApiKey();

  if (!apiKey) {
    const error = new Error('TMDB API Key is missing. Please set VITE_TMDB_API_KEY in your .env file or connect it via Settings.');
    error.code = 'NO_API_KEY';
    throw error;
  }

  const queryParams = new URLSearchParams({
    api_key: apiKey,
    language: 'en-US',
    ...params,
  });

  const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;

  let response;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      response = await fetch(url);
      break;
    } catch (netErr) {
      if (attempts >= maxAttempts) {
        const error = new Error(`Network error: Unable to connect to TMDB API (${netErr.message}).`);
        error.code = 'NETWORK_ERROR';
        error.cause = netErr;
        throw error;
      }
      await new Promise((r) => setTimeout(r, 350 * attempts));
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      const error = new Error('Invalid TMDB API Key. Please verify your API Key in .env or Settings.');
      error.code = 'INVALID_API_KEY';
      throw error;
    }
    if (response.status === 404) {
      const error = new Error('The requested movie or resource was not found on TMDB.');
      error.code = 'NOT_FOUND';
      throw error;
    }
    if (response.status === 429) {
      const error = new Error('Rate limit exceeded. Please wait a moment before trying again.');
      error.code = 'RATE_LIMITED';
      throw error;
    }
    const error = new Error(`TMDB API request failed with status: ${response.status}`);
    error.code = `HTTP_${response.status}`;
    throw error;
  }

  return response.json();
}

/**
 * 1. Trending Movies
 */
export async function getTrendingMovies(timeWindow = 'week', page = 1) {
  const data = await tmdbFetch(`/trending/movie/${timeWindow}`, { page });
  return {
    results: data.results || [],
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

/**
 * 2. Popular Movies
 */
export async function getPopularMovies(page = 1) {
  const data = await tmdbFetch('/movie/popular', { page });
  return {
    results: data.results || [],
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

/**
 * 3. Top-Rated Movies
 */
export async function getTopRatedMovies(page = 1) {
  const data = await tmdbFetch('/movie/top_rated', { page });
  return {
    results: data.results || [],
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

/**
 * 4. Upcoming Movies
 */
export async function getUpcomingMovies(page = 1) {
  const data = await tmdbFetch('/movie/upcoming', { page });
  return {
    results: data.results || [],
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

/**
 * 5. Search Movies
 */
export async function searchMovies(query, page = 1) {
  if (!query || !query.trim()) {
    return getTrendingMovies('week', page);
  }

  const data = await tmdbFetch('/search/movie', {
    query: query.trim(),
    page,
    include_adult: false,
  });

  return {
    results: data.results || [],
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

/**
 * 6. Movie Details (with videos, credits, recommendations, similar)
 */
export async function getMovieDetails(movieId) {
  if (!movieId) throw new Error('Movie ID is required');

  const data = await tmdbFetch(`/movie/${movieId}`, {
    append_to_response: 'videos,credits,recommendations,similar',
  });

  return data;
}

/**
 * 7. Movie Recommendations
 */
export async function getMovieRecommendations(movieId, page = 1) {
  if (!movieId) throw new Error('Movie ID is required');

  const data = await tmdbFetch(`/movie/${movieId}/recommendations`, { page });
  return {
    results: data.results || [],
    page: data.page,
    totalPages: data.total_pages,
  };
}

/**
 * 8. Movie Genres
 */
export async function getMovieGenres() {
  const data = await tmdbFetch('/genre/movie/list');
  return data.genres || [];
}

/**
 * 9. Discover Movies (with genre filtering and sorting)
 */
export async function discoverMovies({ genreId, sortBy = 'popularity.desc', page = 1 } = {}) {
  const params = {
    page,
    sort_by: sortBy,
    include_adult: false,
  };

  if (genreId && genreId !== 'all') {
    params.with_genres = genreId;
  }

  if (sortBy.startsWith('vote_average')) {
    params['vote_count.gte'] = 150;
  }

  const data = await tmdbFetch('/discover/movie', params);
  return {
    results: data.results || [],
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}
