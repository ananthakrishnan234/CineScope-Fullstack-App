import { useState, useEffect } from 'react';
import { Container, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import Hero from '../hero/Hero';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

/**
 * Home page — carousel + search bar + genre filter chips.
 *
 * Search and genre filter work in real time against the backend's
 * /movies/search?title=...&genre=... endpoint.
 *
 * When the search bar is empty AND no genre is selected,
 * the original carousel view is shown.
 */
const Home = ({ movies, isInWatchlist, addToWatchlist, removeFromWatchlist }) => {
  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedGenre, setSelectedGenre]   = useState('');
  const [genres, setGenres]                 = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searching, setSearching]           = useState(false);

  // Load available genres on mount
  useEffect(() => {
    api.get('/movies/genres')
      .then(res => setGenres(res.data || []))
      .catch(() => {});
  }, []);

  // Run search whenever term or genre changes
  useEffect(() => {
    const isFiltering = searchTerm.trim() || selectedGenre;

    if (!isFiltering) {
      setFilteredMovies([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timeout = setTimeout(() => {
      api.get('/movies/search', {
        params: { title: searchTerm, genre: selectedGenre, page: 0, size: 20 }
      })
        .then(res => {
          setFilteredMovies(res.data.content || []);
          setSearching(false);
        })
        .catch(() => setSearching(false));
    }, 400); // 400ms debounce — avoids calling API on every keystroke

    return () => clearTimeout(timeout);
  }, [searchTerm, selectedGenre]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
  };

  const isFiltering = searchTerm.trim() || selectedGenre;
  const displayMovies = isFiltering ? filteredMovies : movies;

  return (
    <div>
      {/* ── Search and filter bar ── */}
      <Container fluid className="py-3 px-4" style={{ backgroundColor: '#111' }}>

        {/* Search input */}
        <InputGroup className="mb-3" style={{ maxWidth: '600px' }}>
          <InputGroup.Text style={{ backgroundColor: '#222', borderColor: '#444', color: '#aaa' }}>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ backgroundColor: '#1a1a1a', color: 'white', borderColor: '#444' }}
          />
          {isFiltering && (
            <Button variant="outline-secondary" onClick={clearFilters}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          )}
        </InputGroup>

        {/* Genre filter chips */}
        <div className="d-flex flex-wrap gap-2 mb-2">
          {genres.map(genre => (
            <Badge
              key={genre}
              bg={selectedGenre === genre ? 'warning' : 'secondary'}
              text={selectedGenre === genre ? 'dark' : 'white'}
              onClick={() => setSelectedGenre(prev => prev === genre ? '' : genre)}
              style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '12px' }}
            >
              {genre}
            </Badge>
          ))}
        </div>

      </Container>

      {/* ── Results ── */}
      {isFiltering ? (
        <Container fluid className="py-3 px-4">
          {searching ? (
            <p style={{ color: '#aaa' }}>Searching...</p>
          ) : filteredMovies.length === 0 ? (
            <p style={{ color: '#aaa' }}>No movies found. Try a different search.</p>
          ) : (
            <>
              <p style={{ color: '#aaa', marginBottom: '1rem' }}>
                {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found
              </p>
              {/* Grid of movie cards for search results */}
              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
                {filteredMovies.map(movie => (
                  <div key={movie.imdbId} className="col">
                    <MovieCard
                      movie={movie}
                      isInWatchlist={isInWatchlist}
                      addToWatchlist={addToWatchlist}
                      removeFromWatchlist={removeFromWatchlist}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </Container>
      ) : (
        // Default view — Hero carousel
        <Hero
          movies={movies}
          isInWatchlist={isInWatchlist}
          addToWatchlist={addToWatchlist}
          removeFromWatchlist={removeFromWatchlist}
        />
      )}
    </div>
  );
};

// ── Small movie card used in search results ──────────────────────────────────

const MovieCard = ({ movie, isInWatchlist, addToWatchlist, removeFromWatchlist }) => {
  const { isLoggedIn } = useAuth();

  const inList = isInWatchlist(movie.imdbId);

  return (
    <div
      className="card h-100"
      style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', cursor: 'pointer' }}
    >
      <a href={`/movies/${movie.imdbId}`}>
        <img
          src={movie.poster}
          alt={movie.title}
          className="card-img-top"
          style={{ height: '220px', objectFit: 'cover' }}
          onError={e => { e.target.src = 'https://via.placeholder.com/200x300?text=No+Image'; }}
        />
      </a>
      <div className="card-body p-2">
        <p className="card-title mb-1" style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
          {movie.title}
        </p>
        {movie.averageRating > 0 && (
          <small style={{ color: 'gold' }}>★ {movie.averageRating.toFixed(1)}</small>
        )}
        <div className="mt-2 d-flex gap-1 flex-wrap">
          <a href={`/movies/${movie.imdbId}`}>
            <button className="btn btn-outline-info btn-sm" style={{ fontSize: '11px' }}>Details</button>
          </a>
          {isLoggedIn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                inList ? removeFromWatchlist(movie.imdbId) : addToWatchlist(movie.imdbId);
              }}
              className={`btn btn-sm ${inList ? 'btn-warning' : 'btn-outline-warning'}`}
              style={{ fontSize: '11px' }}
            >
              {inList ? '★ Saved' : '☆ Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;