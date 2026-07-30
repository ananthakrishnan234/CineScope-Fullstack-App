import './Hero.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../context/AuthContext';

/**
 * Hero carousel component.
 *
 * Changes from original:
 *   - Removed <Paper> from @mui/material (saves ~300KB bundle)
 *   - Added watchlist heart button per movie (only shown when logged in)
 *   - Added star rating badge on each movie card
 *   - Added genre badges
 *   - Added "Details" button linking to /movies/:imdbId
 *   - Carousel now filters movies that have valid poster AND backdrops
 *   - Fixed: trailerLink URL parsing is wrapped in try/catch
 */
const Hero = ({ movies, isInWatchlist, addToWatchlist, removeFromWatchlist }) => {
  const navigate          = useNavigate();
  const { isLoggedIn }    = useAuth();

  const goToReviews = (movieId) => navigate(`/Reviews/${movieId}`);

  /**
   * Safely extracts the YouTube video ID from a YouTube URL.
   * The original code would crash if the URL was malformed.
   */
  const getTrailerId = (url) => {
    try {
      return new URLSearchParams(new URL(url).search).get('v');
    } catch {
      return null;
    }
  };

  return (
    <div className="movie-carousel-container">
      <Carousel showThumbs={false} infiniteLoop autoPlay interval={5000}>
        {movies
          ?.filter(movie => movie.poster && movie.backdrops?.length > 0)
          .map((movie) => {
            const trailerId = getTrailerId(movie.trailerLink);
            const backdrop  = movie.backdrops[0];
            const inList    = isInWatchlist(movie.imdbId);

            return (
              <div key={movie.imdbId}>
                {/* Removed <Paper> — replaced with plain div */}
                <div className="movie-card-container">
                  <div className="movie-card" style={{ '--img': `url(${backdrop})` }}>
                    <div className="movie-detail">

                      {/* Poster */}
                      <div className="movie-poster">
                        <img src={movie.poster} alt={movie.title} />
                      </div>

                      {/* Title + rating + genres */}
                      <div className="movie-info">
                        <div className="movie-title">
                          <h4>{movie.title}</h4>
                        </div>

                        {/* Star rating badge */}
                        {movie.averageRating > 0 && (
                          <div className="movie-rating">
                            ★ {movie.averageRating.toFixed(1)}
                            <span className="rating-label"> / 5</span>
                          </div>
                        )}

                        {/* Genre badges */}
                        <div className="movie-genres">
                          {movie.genres?.slice(0, 3).map(g => (
                            <span key={g} className="genre-badge">{g}</span>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="movie-buttons-container">

                        {/* Play trailer */}
                        {trailerId && (
                          <Link to={`/Trailer/${trailerId}`}>
                            <FontAwesomeIcon
                              className="play-button-icon"
                              icon={faCirclePlay}
                              size="2x"
                            />
                          </Link>
                        )}

                        {/* Reviews */}
                        <Button variant="info" size="sm" onClick={() => goToReviews(movie.imdbId)}>
                          Reviews
                        </Button>

                        {/* Details page */}
                        <Button
                          variant="outline-light"
                          size="sm"
                          onClick={() => navigate(`/movies/${movie.imdbId}`)}
                        >
                          Details
                        </Button>

                        {/* Watchlist heart — only shown when logged in */}
                        {isLoggedIn && (
                          <button
                            className={`watchlist-btn ${inList ? 'in-list' : ''}`}
                            onClick={() =>
                              inList
                                ? removeFromWatchlist(movie.imdbId)
                                : addToWatchlist(movie.imdbId)
                            }
                            title={inList ? 'Remove from watchlist' : 'Add to watchlist'}
                          >
                            <FontAwesomeIcon icon={inList ? faHeart : faHeartBroken} />
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </Carousel>
    </div>
  );
};

export default Hero;