import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import ReviewForm from '../reviewForm/ReviewForm';
import './Reviews.css';

/**
 * Reviews page — /Reviews/:movieId
 *
 * Shows:
 *   - Movie poster + title as a mini header
 *   - Average rating summary
 *   - ReviewForm (for logged-in users) or a login prompt
 *   - Full list of all reviews with author, stars, date, and body
 *
 * Changes from original:
 *   - Added average rating bar at the top
 *   - Each review now shows author name, star rating, and formatted date
 *   - New reviews submitted via ReviewForm appear at the top immediately
 *     (optimistic UI update — no page reload needed)
 *   - Added a back button
 *   - Loading spinner while movie data loads
 *
 * Props:
 *   getMovieData — function to fetch movie from API
 *   movie        — current movie object (from App.js state)
 *   reviews      — array of reviews (from App.js state)
 *   setReviews   — setter to add new reviews to the list
 */
const Reviews = ({ getMovieData, movie, reviews, setReviews }) => {
  const { movieId } = useParams();
  const navigate    = useNavigate();

  // Fetch movie data when the page loads or the movieId changes
  useEffect(() => {
    getMovieData(movieId);
    window.scrollTo(0, 0);
  }, [movieId]); // eslint-disable-line

  // ── Loading state ───────────────────────────────────────────────────────────
  if (!movie || movie.imdbId !== movieId) {
    return (
      <div className="reviews-loading">
        <Spinner animation="border" variant="warning" />
        <p>Loading reviews...</p>
      </div>
    );
  }

  // ── Render star icons for a given rating ────────────────────────────────────
  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map((n) => (
      <FontAwesomeIcon
        key={n}
        icon={faStar}
        style={{
          color: n <= rating ? 'gold' : '#333',
          fontSize: '13px',
          marginRight: '2px',
        }}
      />
    ));

  return (
    <div className="reviews-page">
      <Container className="py-4">

        {/* ── Back button ── */}
        <Button variant="link" className="reviews-back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </Button>

        {/* ── Movie mini header ── */}
        <div className="reviews-movie-header">
          <img
            src={movie.poster}
            alt={movie.title}
            className="reviews-poster"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/80x120?text=?';
            }}
          />
          <div>
            <h3 className="reviews-movie-title">{movie.title}</h3>
            <p className="reviews-movie-date">{movie.releaseDate}</p>
            {/* Average rating summary */}
            {movie.averageRating > 0 ? (
              <div className="reviews-avg">
                <span className="reviews-avg-score">★ {movie.averageRating.toFixed(1)}</span>
                <span className="reviews-avg-label">
                  &nbsp;/ 5 &nbsp;·&nbsp; {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <p className="reviews-no-rating">No ratings yet</p>
            )}
          </div>
        </div>

        <Row className="mt-4">

          {/* ── Left column: submit form ── */}
          <Col xs={12} md={5} className="mb-4">
            <ReviewForm movie={movie} setReviews={setReviews} />
          </Col>

          {/* ── Right column: existing reviews ── */}
          <Col xs={12} md={7}>
            <h5 style={{ color: 'gold', marginBottom: '16px' }}>
              {reviews.length > 0
                ? `${reviews.length} Review${reviews.length !== 1 ? 's' : ''}`
                : 'No reviews yet'}
            </h5>

            {reviews.length === 0 ? (
              <div className="reviews-empty">
                <p>Be the first to review this movie!</p>
              </div>
            ) : (
              reviews.map((review, index) => (
                <div key={review.id || index} className="review-card">

                  {/* Header: author + stars + date */}
                  <div className="review-card-header">
                    <div className="review-card-author-row">
                      <span className="review-card-author">
                        {review.authorName || 'Anonymous'}
                      </span>
                      <span className="review-card-stars">
                        {review.rating ? renderStars(review.rating) : null}
                      </span>
                    </div>
                    <span className="review-card-date">
                      {review.created
                        ? new Date(review.created).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>

                  {/* Review body */}
                  <p className="review-card-body">{review.body}</p>

                </div>
              ))
            )}
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default Reviews;