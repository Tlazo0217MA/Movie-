import React, { useState, useEffect, useContext } from 'react';
import { Alert, Container, Spinner, Table, Button, Modal, Form } from 'react-bootstrap';
import { fetchUserReviews, deleteReview, updateReview } from '../services/api'; 
import StarRating from '../components/StarRating';
import { AuthContext } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
    const { currentUser, loading: authLoading } = useContext(AuthContext) || {}; 
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [currentReview, setCurrentReview] = useState(null); 
    const [newText, setNewText] = useState('');
    const [newRating, setNewRating] = useState(0);

    // 🚨 FIX 3: Updated to use fetchUserReviews from the api.js file
    const fetchUserReviewsAndRatings = async (token) => {
        if (!token) return; 

        setLoading(true);
        try {
            // Replaced direct axios call with the clean, centralized API function
            const reviewsData = await fetchUserReviews(token);
            
            setReviews(reviewsData); 
        } catch (err) {
            console.error("Error fetching user reviews:", err.response?.data || err.message);
            setError('Failed to load your reviews. Please ensure the backend is running and you are logged in.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (!authLoading && !currentUser) {
            navigate('/login'); 
            return;
        }
        if (currentUser) {
            currentUser.getIdToken().then(token => fetchUserReviewsAndRatings(token));
        }
    }, [currentUser, authLoading, navigate]);


    
    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review/rating?')) return;
        
        try {
            const token = await currentUser.getIdToken();
            await deleteReview(reviewId, token); 

            setReviews(reviews.filter(r => r.id !== reviewId));
            alert('Review deleted successfully.');
        } catch (err) {
            console.error("Error deleting review:", err.response?.data || err.message);
            alert(`Failed to delete review: ${err.response?.data?.error || 'Check server connection.'}`);
        }
    };
    

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!currentReview || (newText.trim() === currentReview.text && newRating === currentReview.rating)) {
            setModalShow(false);
            return;
        }

        try {
            const token = await currentUser.getIdToken();
            const updatePayload = {
                reviewText: newText !== currentReview.text ? newText : undefined,
                rating: newRating !== currentReview.rating ? newRating : undefined,
            };

            await updateReview(currentReview.id, updatePayload, token); 

            setModalShow(false);
            alert('Review updated successfully.');

            currentUser.getIdToken().then(token => fetchUserReviewsAndRatings(token)); 

        } catch (err) {
            console.error("Error updating review:", err.response?.data || err.message);
            alert(`Failed to update review: ${err.response?.data?.error || 'Check authorization/server.'}`);
        }
    };

    const openEditModal = (review) => {
        setCurrentReview(review);
        setNewText(review.text);
        setNewRating(review.rating);
        setModalShow(true);
    };

    // Modal Component remains the same, but defined within the component for simplicity
    const EditModal = () => (
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
            <Modal.Header closeButton style={{ backgroundColor: 'var(--card-dark)', borderColor: 'var(--border-dark)' }}>
                <Modal.Title className="text-light">Edit Review for: {currentReview?.movieTitle || 'Movie'}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: 'var(--background-dark)' }}>
                <Form onSubmit={handleUpdate}>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-light">Rating ({newRating} Stars)</Form.Label>
                        <StarRating 
                            rating={newRating} 
                            onRating={setNewRating}
                            size={25}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-light">Review Text</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            style={{ backgroundColor: 'var(--card-dark)', color: 'var(--text-light)' }}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mt-2">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );

    if (authLoading || loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="light" />
                <p className="mt-2 text-light">Loading profile data...</p>
            </div>
        );
    }
    
    if (error) {
        return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
    }
    
    if (!currentUser) {
        return <Alert variant="warning" className="mt-5 text-center">Please log in to view this page.</Alert>;
    }


    return (
        <Container className="py-4 text-light">
            <h2 className="mb-4">My Reviews and Ratings</h2>
            <p className="text-muted">Manage your contributions to the platform.</p>

            {reviews.length === 0 ? (
                <Alert variant="info" className="mt-4">
                    You haven't submitted any reviews or ratings yet.
                </Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover variant="dark" className="shadow-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Movie Title</th>
                                <th>Rating</th>
                                <th>Review Excerpt</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review, index) => (
                                <tr key={review.id}>
                                    <td>{index + 1}</td>
                                    {/* Link to the details page for easy navigation */}
                                    <td>
                                        <a href={`/details/${review.itemId}`} className="text-info text-decoration-none">
                                            {review.movieTitle || review.itemId}
                                        </a>
                                    </td>
                                    <td><StarRating rating={review.rating} readOnly={true} size={18} /></td>
                                    <td>
                                        {review.text 
                                            ? `${review.text.substring(0, 50)}${review.text.length > 50 ? '...' : ''}` 
                                            : 'No text provided'}
                                    </td>
                                    <td>
                                        {/* Improved date formatting */}
                                        {review.createdAt 
                                            ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() 
                                            : 'N/A'}
                                    </td>
                                    <td>
                                        <Button 
                                            variant="outline-info" 
                                            size="sm" 
                                            className="me-2" 
                                            onClick={() => openEditModal(review)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm" 
                                            onClick={() => handleDelete(review.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
            
            {currentReview && <EditModal />}

        </Container>
    );
};

export default ProfilePage;