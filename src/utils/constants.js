export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const POSTER_SIZES = {
  sm: `${IMAGE_BASE_URL}w342`,
  md: `${IMAGE_BASE_URL}w500`,
  lg: `${IMAGE_BASE_URL}w780`,
  original: `${IMAGE_BASE_URL}original`,
};

export const BACKDROP_SIZES = {
  sm: `${IMAGE_BASE_URL}w780`,
  md: `${IMAGE_BASE_URL}w1280`,
  original: `${IMAGE_BASE_URL}original`,
};

export const PROFILE_SIZES = {
  sm: `${IMAGE_BASE_URL}w185`,
  md: `${IMAGE_BASE_URL}h632`,
  original: `${IMAGE_BASE_URL}original`,
};

export const CATEGORIES = [
  { id: 'trending', label: 'Trending', type: 'trending' },
  { id: 'popular', label: 'Popular', type: 'popular' },
  { id: 'top_rated', label: 'Top Rated', type: 'top_rated' },
  { id: 'upcoming', label: 'Upcoming', type: 'upcoming' },
];

export const FALLBACK_GENRES = [
  { id: 'all', name: 'All Genres' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
];
