import { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

/**
 * ReviewForm — allows a logged-in user to submit a review for a movie.
 *
 * Changes from original:
 *   - Added interactive star rating selector (1–5)
 *   - Added character counter (up to 1000 chars)
 *   - Shows error message from the backend if submission fails
 *   - Shows success message after submission
 *   - Clears the form properly after submit (original had a bug where the
 *     review text disappeared but didn't reset the React state)
 *   - Sends { reviewBody, imdbId, rating } matching the new ReviewRequest DTO
 *   - Disabled when user is not logged in (shows login prompt instead)
 *
 * Props:
 *   movie       — the current Movie object (we need movie.imdbId)
 *   setReviews  — setter from the parent to add the new review to the list
 */
const ReviewForm = ({ movie, setReviews }) => {
  const { isLoggedIn }            = useAuth();
  const [reviewBody, setReviewBody] = useState('');
  const [rating, setRating]         = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  const MAX_CHARS = 1000;
  const charsLeft = MAX_CHARS - reviewBody.length;

  // ── Submit handler ──────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    if (reviewBody.trim().length < 5) {
      setError('Review must be at least 5 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/reviews', {
        reviewBody: reviewBody.trim(),
        imdbId: movie.imdbId,
        rating,
      });

      // Add the new review to the top of the list in the parent component
      setReviews(prev => [response.data, ...prev]);

      // Reset form
      setReviewBody('');
      setRating(0);
      setSuccess('Review submitted! Thank you.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Not logged in — show a prompt instead of the form ──────────────────────

  if (!isLoggedIn) {
    return (
      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
          color: '#aaa',
          fontSize: '14px',
        }}
      >
        Please <strong style={{ color: 'gold' }}>login</strong> to write a review.
      </div>
    );
  }

  // ── Review form ─────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <h6 style={{ color: 'gold', marginBottom: '14px' }}>Write a Review</h6>

      {error   && <Alert variant="danger"  className="py-2" style={{ fontSize: '13px' }}>{error}</Alert>}
      {success && <Alert variant="success" className="py-2" style={{ fontSize: '13px' }}>{success}</Alert>}

      <Form onSubmit={handleSubmit}>

        {/* ── Star rating selector ── */}
        <Form.Group className="mb-3">
          <Form.Label style={{ color: '#ccc', fontSize: '14px' }}>Your Rating</Form.Label>
          <div className="d-flex gap-1" style={{ fontSize: '24px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon
                key={star}
                icon={(hoverRating || rating) >= star ? faStar : faStarEmpty}
                style={{
                  color: (hoverRating || rating) >= star ? 'gold' : '#555',
                  cursor: 'pointer',
                  transition: 'color 0.1s',
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
            {rating > 0 && (
              <span style={{ color: '#aaa', fontSize: '13px', alignSelf: 'center', marginLeft: '8px' }}>
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
              </span>
            )}
          </div>
        </Form.Group>

        {/* ── Review text area ── */}
        <Form.Group className="mb-3">
          <Form.Label style={{ color: '#ccc', fontSize: '14px' }}>Your Review</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="What did you think of this movie? (5–1000 characters)"
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value)}
            maxLength={MAX_CHARS}
            required
            style={{
              backgroundColor: '#2a2a2a',
              color: 'white',
              borderColor: '#444',
              resize: 'none',
              fontSize: '14px',
            }}
          />
          {/* Character counter — turns red when nearing limit */}
          <div
            style={{
              textAlign: 'right',
              fontSize: '12px',
              marginTop: '4px',
              color: charsLeft < 50 ? '#e74c3c' : '#888',
            }}
          >
            {charsLeft} characters remaining
          </div>
        </Form.Group>

        {/* ── Submit button ── */}
        <Button
          type="submit"
          variant="warning"
          disabled={loading}
          style={{ minWidth: '120px' }}
        >
          {loading
            ? <><Spinner size="sm" className="me-2" />Submitting...</>
            : 'Submit Review'
          }
        </Button>

      </Form>
    </div>
  );
};

export default ReviewForm;