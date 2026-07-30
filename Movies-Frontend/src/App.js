import './App.css';
import api from './api/axiosConfig';
import { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import NotFound from './components/notFound/NotFound';
import MovieDetail from './components/movieDetail/MovieDetail';
import WatchList from './components/watchList/WatchList';
import { useAuth } from './context/AuthContext';

function App() {
  const [movies, setMovies]     = useState([]);
  const [movie, setMovie]       = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const { isLoggedIn }          = useAuth();

  // ─── Fetch all movies on mount ───────────────────────────────────────────

  const getMovies = useCallback(async () => {
    try {
      // Uses paginated endpoint — page 0, size 20, sorted by title
      const response = await api.get('/movies?page=0&size=20&sortBy=title');
      // Spring Page object has .content array
      setMovies(response.data.content || []);
    } catch (err) {
      console.error('Failed to load movies:', err);
    }
  }, []);

  // ─── Fetch a single movie's data (for Reviews / MovieDetail page) ────────

  const getMovieData = useCallback(async (movieId) => {
    try {
      const response = await api.get(`/movies/${movieId}`);
      const singleMovie = response.data;
      setMovie(singleMovie);
      setReviews(singleMovie.reviews || []);
    } catch (error) {
      console.error('Failed to load movie:', error);
    }
  }, []);

  // ─── Fetch watchlist when user is logged in ──────────────────────────────

  const getWatchlist = useCallback(async () => {
    if (!isLoggedIn) {
      setWatchlist([]);
      return;
    }
    try {
      const response = await api.get('/users/watchlist');
      setWatchlist(response.data || []);
    } catch (err) {
      console.error('Failed to load watchlist:', err);
    }
  }, [isLoggedIn]);

  // ─── Add / remove from watchlist ─────────────────────────────────────────

  const addToWatchlist = useCallback(async (imdbId) => {
    if (!isLoggedIn) return;
    try {
      await api.post(`/users/watchlist/${imdbId}`);
      setWatchlist(prev => [...new Set([...prev.map(m => m.imdbId), imdbId])]);
      getWatchlist(); // Refresh full movie objects
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  }, [isLoggedIn, getWatchlist]);

  const removeFromWatchlist = useCallback(async (imdbId) => {
    if (!isLoggedIn) return;
    try {
      await api.delete(`/users/watchlist/${imdbId}`);
      setWatchlist(prev => prev.filter(m => m.imdbId !== imdbId));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  }, [isLoggedIn]);

  const isInWatchlist = useCallback((imdbId) => {
    return watchlist.some(m => (typeof m === 'string' ? m : m.imdbId) === imdbId);
  }, [watchlist]);

  // ─── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  useEffect(() => {
    getWatchlist();
  }, [getWatchlist, isLoggedIn]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>

          {/* Home — movie carousel + search */}
          <Route
            index
            element={
              <Home
                movies={movies}
                isInWatchlist={isInWatchlist}
                addToWatchlist={addToWatchlist}
                removeFromWatchlist={removeFromWatchlist}
              />
            }
          />

          {/* Movie detail page */}
          <Route
            path="/movies/:imdbId"
            element={
              <MovieDetail
                getMovieData={getMovieData}
                movie={movie}
                isInWatchlist={isInWatchlist}
                addToWatchlist={addToWatchlist}
                removeFromWatchlist={removeFromWatchlist}
              />
            }
          />

          {/* Trailer player */}
          <Route path="/Trailer/:ytTrailerId" element={<Trailer />} />

          {/* Reviews page */}
          <Route
            path="/Reviews/:movieId"
            element={
              <Reviews
                getMovieData={getMovieData}
                movie={movie}
                reviews={reviews}
                setReviews={setReviews}
              />
            }
          />

          {/* Watchlist */}
          <Route
            path="/watchList"
            element={
              <WatchList
                watchlist={watchlist}
                removeFromWatchlist={removeFromWatchlist}
              />
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;