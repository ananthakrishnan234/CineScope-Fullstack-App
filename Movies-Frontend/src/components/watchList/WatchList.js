import './WatchList.css';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartBroken, faStar, faFilm } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

/**
 * WatchList page — /watchList
 *
 * Shows the full Movie objects the logged-in user has saved.
 * If not logged in, shows a prompt to login.
 * If logged in but watchlist is empty, shows an empty state with a CTA.
 *
 * Props:
 *   watchlist            — array of Movie objects from App.js
 *   removeFromWatchlist  — function(imdbId) to remove a movie
 */
const WatchList = ({ watchlist, removeFromWatchlist }) => {
  const { isLoggedIn } = useAuth();
  const navigate       = useNavigate();

  // ── Not logged in ─────────────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <div className="watchlist-page">
        <Container className="watchlist-container">
          <div className="watchlist-empty">
            <FontAwesomeIcon icon={faFilm} className="watchlist-empty-icon" />
            <h4>Login to see your Watch List</h4>
            <p>Save movies you want to watch later by clicking the heart icon.</p>
            <Button variant="warning" onClick={() => navigate('/')}>
              Browse Movies
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // ── Logged in but list is empty ───────────────────────────────────────────

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="watchlist-page">
        <Container className="watchlist-container">
          <h3 className="watchlist-title">My Watch List</h3>
          <div className="watchlist-empty">
            <FontAwesomeIcon icon={faFilm} className="watchlist-empty-icon" />
            <h5>Your watchlist is empty</h5>
            <p>Browse movies and click the heart icon to save them here.</p>
            <Button variant="warning" onClick={() => navigate('/')}>
              Browse Movies
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // ── Has movies ────────────────────────────────────────────────────────────

  return (
    <div className="watchlist-page">
      <Container className="watchlist-container">

        <div className="watchlist-header">
          <h3 className="watchlist-title">My Watch List</h3>
          <span className="watchlist-count">
            {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Movie grid */}
        <div className="watchlist-grid">
          {watchlist.map((movie) => (
            <WatchListCard
              key={movie.imdbId}
              movie={movie}
              removeFromWatchlist={removeFromWatchlist}
            />
          ))}
        </div>

      </Container>
    </div>
  );
};

// ── Individual watchlist card ─────────────────────────────────────────────────

const WatchListCard = ({ movie, removeFromWatchlist }) => {
  return (
    <div className="wl-card">

      {/* Poster — click goes to movie detail page */}
      <Link to={`/movies/${movie.imdbId}`} className="wl-poster-link">
        <img
          src={movie.poster}
          alt={movie.title}
          className="wl-poster"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
          }}
        />
      </Link>

      {/* Card body */}
      <div className="wl-body">

        {/* Title */}
        <Link to={`/movies/${movie.imdbId}`} className="wl-title-link">
          <h6 className="wl-title">{movie.title}</h6>
        </Link>

        {/* Release year */}
        <p className="wl-year">{movie.releaseDate}</p>

        {/* Star rating */}
        {movie.averageRating > 0 && (
          <div className="wl-rating">
            <FontAwesomeIcon icon={faStar} style={{ color: 'gold', fontSize: '12px' }} />
            <span>{movie.averageRating.toFixed(1)}</span>
          </div>
        )}

        {/* Genre chips — max 2 to avoid overflow */}
        <div className="wl-genres">
          {movie.genres?.slice(0, 2).map((g) => (
            <span key={g} className="wl-genre-chip">{g}</span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="wl-actions">
          <Link to={`/Reviews/${movie.imdbId}`}>
            <button className="wl-btn wl-btn-review">Reviews</button>
          </Link>
          <button
            className="wl-btn wl-btn-remove"
            onClick={() => removeFromWatchlist(movie.imdbId)}
            title="Remove from watchlist"
          >
            <FontAwesomeIcon icon={faHeartBroken} />
            &nbsp;Remove
          </button>
        </div>

      </div>
    </div>
  );
};

export default WatchList;