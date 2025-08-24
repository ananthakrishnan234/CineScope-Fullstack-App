import { useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';

const Reviews = ({ getMovieData, movie, reviews, setReviews }) => {
    const revText = useRef();
    const { movieId } = useParams();

    useEffect(() => {
        getMovieData(movieId);
    }, [movieId]);

    const addReview = async (e) => {
        e.preventDefault();
        const rev = revText.current;
        if (!rev?.value?.trim()) return;

        try {
            await api.post("/reviews", {
                reviewBody: rev.value,
                imdbId: movieId
            });

            rev.value = "";
            getMovieData(movieId); // Fetch updated movie+reviews from backend
        } catch (err) {
            console.error("Review submission failed:", err);
        }
    };

    return (
        <Container>
            <Row>
                <Col><h3>Reviews</h3></Col>
            </Row>
            <Row className="mt-2">
                <Col md={4}>
                    <img src={movie?.poster} alt={movie?.title} style={{ width: "100%" }} />
                </Col>
                <Col>
                    <ReviewForm handleSubmit={addReview} revText={revText} labelText="Write a Review?" />
                    <hr />
                    {reviews?.length > 0 ? (
                        reviews.map((r, index) => (
                            <div key={index}>
                                <Row>
                                    <Col>{r.body}</Col>
                                </Row>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet. Be the first!</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Reviews;
