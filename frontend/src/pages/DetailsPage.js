import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; 
import { Alert, Card, Form, Button, Spinner, Container, Row, Col, ListGroup } from 'react-bootstrap';
import StarRating from '../components/StarRating';
import { AuthContext } from '../services/AuthContext'; 

const OMDB_API_KEY = 'de9d2f77';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const BACKEND_URL = 'http://localhost:5000/api';

const DetailsPage = () => {
    const { movieId } = useParams(); 
    
    const { currentUser } = useContext(AuthContext) || {}; 

    const [movie, setMovie] = useState(null);
    const [movieLoading, setMovieLoading] = useState(true);
    const [movieError, setMovieError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const [newReview, setNewReview] = useState({ rating: 0, text: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(OMDB_BASE_URL, {
                    params: {
                        apikey: OMDB_API_KEY,
                        i: movieId, 
                        plot: 'full' 
                    }
                });

                if (response.data.Response === 'True') {
                    setMovie(response.data);
                } else {
                    setMovieError(response.data.Error || 'Movie details not found.');
                }
            } catch (err) {
                setMovieError('Failed to fetch movie details. Network error.');
            } finally {
                setMovieLoading(false);
            }
        };

        fetchMovie();
    }, [movieId]); 

    const fetchReviews = useCallback(async () => {
        setReviewLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/reviews/${movieId}`);
            setReviews(response.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setReviewError('Failed to load existing reviews.');
        } finally {
            setReviewLoading(false);
        }
    }, [movieId]); 

    useEffect(() => {
        fetchReviews();
    }, [movieId, fetchReviews]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('You must be logged in to submit a review.');
            return;
        }
    
        
        if (newReview.rating === 0 || newReview.text.trim() === '') {
            alert('Please provide a rating and a review comment.');
            return;
        }

        setSubmitting(true);
        try {
            const reviewData = {
                movieId: movieId,
                movieTitle: movie.Title, 
                rating: newReview.rating,
                reviewText: newReview.text.trim(),
                userId: currentUser.uid, 
                userName: currentUser.email 
            };

            await axios.post(`${BACKEND_URL}/reviews`, reviewData, {
                headers: {
                    Authorization: `Bearer ${await currentUser.getIdToken()}`
                }
            });

            setNewReview({ rating: 0, text: '' });
            fetchReviews();
            alert('Review submitted successfully!');

        } catch (err) {
            console.error("Error submitting review:", err.response ? err.response.data : err.message);
            alert(`Failed to submit review: ${err.response?.data?.message || 'Check server connection.'}`);
        } finally {
            setSubmitting(false);
        }
    };
    
    
    if (movieLoading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="light" />
                <p className="mt-2">Loading movie details...</p>
            </div>
        );
    }

    if (movieError) {
        return <Alert variant="danger" className="mt-5 text-center">{movieError}</Alert>;
    }


    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 'N/A';
    
    return (
        <Container className="py-4">
            <Row>
                <Col md={4} className="text-center">
                    <img 
                        src={movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'} 
                        alt={movie.Title} 
                        className="img-fluid rounded shadow-lg"
                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                    />
                </Col>
                <Col md={8}>
                    <h1 className="display-4" style={{ color: 'var(--primary)' }}>{movie.Title}</h1>
                    <p className="text-muted fs-5">{movie.Year} &middot; {movie.Rated} &middot; {movie.Runtime}</p>
                    
                    <div className="mb-3">
                        <span className="badge bg-secondary me-2">{movie.Genre}</span>
                        <span className="badge bg-warning text-dark me-2">IMDb: {movie.imdbRating}</span>
                        <span className="badge bg-info text-dark">User Rating: {averageRating} ({reviews.length} reviews)</span>
                    </div>

                    <p className="fs-6">{movie.Plot}</p>
                    
                    <ListGroup variant="flush" className="mt-4">
                        <ListGroup.Item className="bg-transparent text-light border-secondary">
                            **Director:** {movie.Director}
                        </ListGroup.Item>
                        <ListGroup.Item className="bg-transparent text-light border-secondary">
                            **Writers:** {movie.Writer}
                        </ListGroup.Item>
                        <ListGroup.Item className="bg-transparent text-light border-secondary">
                            **Stars:** {movie.Actors}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>

            <hr className="my-5" style={{ borderColor: 'var(--border-dark)' }} />

            <Row>
                <Col md={6}>
                    <h3 className="mb-4">Write a Review</h3>
                    {!currentUser ? (
                        <Alert variant="info">
                            Please <Link to="/login">log in</Link> to submit a review.
                        </Alert>
                    ) : (
                        <Card className="p-4 shadow-sm" style={{ backgroundColor: 'var(--card-dark)', borderColor: 'var(--border-dark)' }}>
                            <Form onSubmit={handleSubmitReview}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Your Rating ({newReview.rating} Stars)</Form.Label>
                                    <StarRating 
                                        rating={newReview.rating} 
                                        onRating={(rate) => setNewReview(prev => ({ ...prev, rating: rate }))}
                                        size={25}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="reviewText">
                                    <Form.Label className="text-light">Your Comment</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3} 
                                        value={newReview.text}
                                        onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                                        placeholder="Share your thoughts on the movie..."
                                        style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-light)' }}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" disabled={submitting}>
                                    {submitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> : 'Submit Review'}
                                </Button>
                            </Form>
                        </Card>
                    )}
                </Col>

                <Col md={6}>
                    <h3 className="mb-4">User Reviews</h3>
                    {reviewLoading ? (
                        <div className="text-center"><Spinner animation="border" variant="light" /></div>
                    ) : reviewError ? (
                        <Alert variant="warning">{reviewError}</Alert>
                    ) : reviews.length === 0 ? (
                        <Alert variant="secondary">No user reviews yet. Be the first!</Alert>
                    ) : (
                        <div className="review-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {reviews.map((review) => (
                                <Card key={review.id} className="mb-3" style={{ backgroundColor: 'var(--card-dark)', borderColor: 'var(--border-dark)' }}>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Card.Title className="fs-5 text-light">{review.userName || review.userId}</Card.Title>
                                            <StarRating rating={review.rating} size={18} readOnly={true} />
                                        </div>
                                        <Card.Text className="text-muted mb-1">
                                            Reviewed on: {review.timestamp ? new Date(review.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </Card.Text>
                                        <Card.Text className="text-light mt-2">
                                            {review.reviewText}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default DetailsPage;