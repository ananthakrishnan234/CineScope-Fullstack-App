import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faHeart, faHeartBroken, faArrowLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import './MovieDetail.css';

/**
 * Movie detail page — /movies/:imdbId
 *
 * Shows:
 *   - Full backdrop image as hero
 *   - Poster + title, release date, genres, average rating
 *   - Watch Trailer and Reviews buttons
 *   - Add/Remove from Watchlist button (logged-in users only)
 *   - List of all reviews with author, date, and star rating
 */
const MovieDetail = ({ getMovieData, movie, isInWatchlist, addToWatchlist, removeFromWatchlist }) => {
  const { imdbId }       = useParams();
  const navigate         = useNavigate();
  const { isLoggedIn }   = useAuth();

  useEffect(() => {
    getMovieData(imdbId);
    // Scroll to top when navigating to a new movie
    window.scrollTo(0, 0);
  }, [imdbId]); // eslint-disable-line

  if (!movie || movie.imdbId !== imdbId) {
    return (
      <div className="detail-loading">
        <Spinner animation="border" variant="warning" />
        <p>Loading movie...</p>
      </div>
    );
  }

  const inList    = isInWatchlist(movie.imdbId);
  const backdrop  = movie.backdrops?.[0] || '';

  const getTrailerId = (url) => {
    try { return new URLSearchParams(new URL(url).search).get('v'); }
    catch { return null; }
  };
  const trailerId = getTrailerId(movie.trailerLink);

  // Render star icons for a given rating (1–5)
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map(n => (
      <FontAwesomeIcon
        key={n}
        icon={faStar}
        style={{ color: n <= rating ? 'gold' : '#444', fontSize: '13px', marginRight: '2px' }}
      />
    ));
  };

  return (
    <div className="movie-detail-page">

      {/* ── Backdrop hero ── */}
      <div
        className="detail-backdrop"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(13,13,13,1)), url(${backdrop})` }}
      />

      <Container className="detail-content">

        {/* Back button */}
        <Button
          variant="link"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </Button>

        <Row className="mt-4">

          {/* ── Poster column ── */}
          <Col xs={12} md={3} className="mb-4">
            <img
              src={movie.poster}
              alt={movie.title}
              className="detail-poster"
              onError={e => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
            />
          </Col>

          {/* ── Info column ── */}
          <Col xs={12} md={9}>

            {/* Title */}
            <h2 className="detail-title">{movie.title}</h2>

            {/* Release date */}
            <p className="detail-date">Released: {movie.releaseDate}</p>

            {/* Average rating */}
            {movie.averageRating > 0 ? (
              <div className="detail-avg-rating">
                <span className="avg-score">★ {movie.averageRating.toFixed(1)}</span>
                <span className="avg-label">/ 5 · {movie.reviews?.length || 0} review{movie.reviews?.length !== 1 ? 's' : ''}</span>
              </div>
            ) : (
              <p className="no-rating">No ratings yet — be the first to review!</p>
            )}

            {/* Genre badges */}
            <div className="detail-genres">
              {movie.genres?.map(g => (
                <Badge key={g} bg="secondary" className="me-1" style={{ fontSize: '12px' }}>
                  {g}
                </Badge>
              ))}
            </div>

            {/* Action buttons */}
            <div className="detail-actions">

              {trailerId && (
                <Link to={`/Trailer/${trailerId}`}>
                  <Button variant="warning" className="me-2">
                    <FontAwesomeIcon icon={faPlay} className="me-2" />
                    Watch Trailer
                  </Button>
                </Link>
              )}

              <Link to={`/Reviews/${movie.imdbId}`}>
                <Button variant="outline-info" className="me-2">
                  Write a Review
                </Button>
              </Link>

              {isLoggedIn && (
                <Button
                  variant={inList ? 'danger' : 'outline-danger'}
                  onClick={() => inList ? removeFromWatchlist(movie.imdbId) : addToWatchlist(movie.imdbId)}
                >
                  <FontAwesomeIcon icon={inList ? faHeart : faHeartBroken} className="me-2" />
                  {inList ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
              )}
            </div>

          </Col>
        </Row>

        {/* ── Reviews section ── */}
        <Row className="mt-5">
          <Col>
            <h4 style={{ color: 'gold', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
              Audience Reviews
            </h4>

            {!movie.reviews || movie.reviews.length === 0 ? (
              <p style={{ color: '#888' }}>No reviews yet. Be the first!</p>
            ) : (
              movie.reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.authorName || 'Anonymous'}</span>
                    <span className="review-stars">{renderStars(review.rating)}</span>
                    <span className="review-date">
                      {review.created
                        ? new Date(review.created).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })
                        : ''}
                    </span>
                  </div>
                  <p className="review-body">{review.body}</p>
                </div>
              ))
            )}
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default MovieDetail;