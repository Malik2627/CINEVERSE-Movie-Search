import React, { useEffect, useState, useMemo, useCallback } from 'react';
import HeroBanner from '../components/HeroBanner';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieRow from '../components/MovieRow';
import MovieGrid from '../components/MovieGrid';
import { useMovieContext } from '../context/MovieContext';
import { useDebounce } from '../hooks/useDebounce';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieRecommendations,
  discoverMovies,
} from '../services/tmdb.js';
import { Flame, Star, Sparkles, Calendar, Compass, Bookmark, Search } from 'lucide-react';

export default function HomePage() {
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    watchlist,
  } = useMovieContext();

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Home streaming rows data
  const [trendingRow, setTrendingRow] = useState([]);
  const [popularRow, setPopularRow] = useState([]);
  const [topRatedRow, setTopRatedRow] = useState([]);
  const [upcomingRow, setUpcomingRow] = useState([]);
  const [recommendedRow, setRecommendedRow] = useState([]);
  const [loadingHomeRows, setLoadingHomeRows] = useState(true);

  // Category / Discover Grid state & pagination
  const [gridMovies, setGridMovies] = useState([]);
  const [gridPage, setGridPage] = useState(1);
  const [gridTotalPages, setGridTotalPages] = useState(1);
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Search Results state & pagination
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingMoreSearch, setLoadingMoreSearch] = useState(false);

  const [apiError, setApiError] = useState(null);

  // ================= 1. Load Home Rows =================
  const loadHomeRows = useCallback(async () => {
    setLoadingHomeRows(true);
    setApiError(null);

    try {
      const [trendRes, popRes, topRes, upRes] = await Promise.all([
        getTrendingMovies('week', 1),
        getPopularMovies(1),
        getTopRatedMovies(1),
        getUpcomingMovies(1),
      ]);

      const trendingList = trendRes.results || [];
      setTrendingRow(trendingList);
      setPopularRow(popRes.results || []);
      setTopRatedRow(topRes.results || []);
      setUpcomingRow(upRes.results || []);

      if (trendingList.length > 0) {
        try {
          const recRes = await getMovieRecommendations(trendingList[0].id, 1);
          setRecommendedRow(recRes.results || []);
        } catch {
          setRecommendedRow(popRes.results?.slice(0, 10) || []);
        }
      }
    } catch (err) {
      setApiError(err);
    } finally {
      setLoadingHomeRows(false);
    }
  }, []);

  useEffect(() => {
    loadHomeRows();
  }, [loadHomeRows]);

  // ================= 2. Live Search with Pagination =================
  useEffect(() => {
    if (!debouncedSearch || !debouncedSearch.trim()) {
      setSearchResults([]);
      setSearchPage(1);
      setSearchTotalPages(1);
      setLoadingSearch(false);
      return;
    }

    let isCurrent = true;
    setLoadingSearch(true);
    setApiError(null);
    setSearchPage(1);

    searchMovies(debouncedSearch.trim(), 1)
      .then((data) => {
        if (isCurrent) {
          setSearchResults(data.results || []);
          setSearchTotalPages(data.totalPages || 1);
          setLoadingSearch(false);
        }
      })
      .catch((err) => {
        if (isCurrent) {
          setApiError(err);
          setSearchResults([]);
          setLoadingSearch(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedSearch]);

  const handleLoadMoreSearch = async () => {
    if (loadingMoreSearch || searchPage >= searchTotalPages) return;
    setLoadingMoreSearch(true);
    const nextPage = searchPage + 1;

    try {
      const data = await searchMovies(debouncedSearch.trim(), nextPage);
      setSearchResults((prev) => [...prev, ...(data.results || [])]);
      setSearchPage(nextPage);
    } catch (err) {
      setApiError(err);
    } finally {
      setLoadingMoreSearch(false);
    }
  };

  // ================= 3. Load Category / Discover Grid with Sorting & Filtering =================
  const fetchCategoryGrid = useCallback(
    async (pageToLoad = 1, append = false) => {
      if (activeCategory === 'home' || activeCategory === 'watchlist') return;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoadingGrid(true);
      }
      setApiError(null);

      try {
        let res;
        if (activeCategory === 'discover') {
          res = await discoverMovies({
            genreId: selectedGenre,
            sortBy,
            page: pageToLoad,
          });
        } else if (activeCategory === 'trending') {
          res = await getTrendingMovies('week', pageToLoad);
        } else if (activeCategory === 'top_rated') {
          res = await getTopRatedMovies(pageToLoad);
        } else if (activeCategory === 'popular') {
          res = await getPopularMovies(pageToLoad);
        } else if (activeCategory === 'upcoming') {
          res = await getUpcomingMovies(pageToLoad);
        } else {
          res = await getTrendingMovies('week', pageToLoad);
        }

        const newResults = res.results || [];
        setGridTotalPages(res.totalPages || 1);
        setGridPage(pageToLoad);

        if (append) {
          setGridMovies((prev) => [...prev, ...newResults]);
        } else {
          setGridMovies(newResults);
        }
      } catch (err) {
        setApiError(err);
        if (!append) setGridMovies([]);
      } finally {
        setLoadingGrid(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, selectedGenre, sortBy]
  );

  // Reload category grid when category, genre, or sort changes
  useEffect(() => {
    fetchCategoryGrid(1, false);
  }, [fetchCategoryGrid]);

  const handleLoadMoreGrid = () => {
    if (loadingMore || gridPage >= gridTotalPages) return;
    fetchCategoryGrid(gridPage + 1, true);
  };

  // Filter in-memory when on views that don't do server-side genre filtering (like search or trending)
  const filterByGenre = (list) => {
    if (selectedGenre === 'all') return list;
    return list.filter((m) => m.genre_ids && m.genre_ids.includes(Number(selectedGenre)));
  };

  // Featured Hero movie
  const heroMovie = useMemo(() => {
    if (trendingRow.length === 0) return null;
    return trendingRow.find((m) => m.backdrop_path) || trendingRow[0];
  }, [trendingRow]);

  const handleScrollToExplore = () => {
    const el = document.getElementById('cineverse-content-start');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const isSearchActive = Boolean(debouncedSearch && debouncedSearch.trim());

  return (
    <main className="main-content">
      {/* Search Header Container */}
      <div className="search-sticky-container">
        <div className="search-bar-inner-box">
          <SearchBar />
        </div>
      </div>

      {/* 1. ACTIVE SEARCH VIEW */}
      {isSearchActive ? (
        <div className="search-results-wrapper animate-fade-in">
          <FilterBar showSort={false} />
          <MovieGrid
            movies={filterByGenre(searchResults)}
            loading={loadingSearch}
            title={`Search Results for "${debouncedSearch.trim()}"`}
            subtitle="Live matches directly from The Movie Database"
            error={apiError}
            onRetry={() => searchMovies(debouncedSearch.trim(), 1)}
            onLoadMore={handleLoadMoreSearch}
            loadingMore={loadingMoreSearch}
            hasMore={searchPage < searchTotalPages}
            emptyIcon={Search}
            emptyTitle="No Titles Found"
            emptyMessage={`We couldn't find any movies matching "${debouncedSearch.trim()}". Try checking for spelling errors or searching with broader keywords.`}
            emptyActionText="Clear Search"
            onEmptyAction={() => setSearchQuery('')}
          />
        </div>
      ) : activeCategory === 'watchlist' ? (
        /* 2. DEDICATED WATCHLIST VIEW */
        <div className="watchlist-showcase-wrapper animate-fade-in" style={{ paddingTop: '1.5rem' }}>
          <MovieGrid
            movies={watchlist}
            loading={false}
            title="My Saved Watchlist"
            subtitle="Your personal collection of bookmarked movies, safely stored in your browser"
            emptyIcon={Bookmark}
            emptyTitle="Your Watchlist is Empty"
            emptyMessage="You haven't added any movies to your watchlist yet. Click the bookmark icon on any movie card or detail view to save it here."
            emptyActionText="Discover Movies"
            onEmptyAction={() => {
              setActiveCategory('discover');
              setSelectedGenre('all');
            }}
          />
        </div>
      ) : activeCategory !== 'home' ? (
        /* 3. DISCOVER / TRENDING / TOP RATED GRID VIEW */
        <div className="category-showcase-wrapper animate-fade-in" style={{ paddingTop: '1.5rem' }}>
          <FilterBar showSort={activeCategory === 'discover'} />
          <MovieGrid
            movies={activeCategory === 'discover' ? gridMovies : filterByGenre(gridMovies)}
            loading={loadingGrid}
            title={
              activeCategory === 'trending'
                ? 'Trending Blockbusters'
                : activeCategory === 'top_rated'
                ? 'All-Time Top Rated Masterpieces'
                : activeCategory === 'discover'
                ? 'Discover Cinema'
                : 'Featured Titles'
            }
            subtitle={
              activeCategory === 'discover'
                ? 'Browse, filter by genre, and sort through millions of titles'
                : activeCategory === 'trending'
                ? 'The most watched blockbusters of the week worldwide'
                : 'Celebrated films with the highest viewer ratings of all time'
            }
            error={apiError}
            onRetry={() => fetchCategoryGrid(1, false)}
            onLoadMore={handleLoadMoreGrid}
            loadingMore={loadingMore}
            hasMore={gridPage < gridTotalPages}
          />
        </div>
      ) : (
        /* 4. HOME STREAMING PLATFORM VIEW */
        <>
          {/* Hero Section */}
          <HeroBanner movie={heroMovie} onExplore={handleScrollToExplore} />

          <div id="cineverse-content-start" className="home-rows-container">
            {/* 1. Trending Now */}
            <MovieRow
              title="Trending Now"
              subtitle="The most-watched blockbusters across the globe this week"
              icon={Flame}
              movies={trendingRow}
              loading={loadingHomeRows}
            />

            {/* 2. Popular Movies */}
            <MovieRow
              title="Popular Movies"
              subtitle="Worldwide box office hits and trending audience favorites"
              icon={Sparkles}
              movies={popularRow}
              loading={loadingHomeRows}
            />

            {/* 3. Top Rated */}
            <MovieRow
              title="Top Rated Masterpieces"
              subtitle="Critically celebrated cinema with the highest ratings of all time"
              icon={Star}
              movies={topRatedRow}
              loading={loadingHomeRows}
            />

            {/* 4. Upcoming in Theaters */}
            <MovieRow
              title="Upcoming in Theaters"
              subtitle="Anticipated premieres and next-season cinematic releases"
              icon={Calendar}
              movies={upcomingRow}
              loading={loadingHomeRows}
            />

            {/* 5. Recommended Movies */}
            <MovieRow
              title="Recommended For You"
              subtitle="Smart algorithm suggestions tailored to top trending selections"
              icon={Compass}
              movies={recommendedRow.length > 0 ? recommendedRow : popularRow.slice(4)}
              loading={loadingHomeRows}
            />
          </div>
        </>
      )}
    </main>
  );
}
