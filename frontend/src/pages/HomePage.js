import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Alert, Spinner, Container } from 'react-bootstrap'; 

const OMDB_API_KEY = 'de9d2f77'; 
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(OMDB_BASE_URL, {
                    params: {
                        apikey: OMDB_API_KEY,
                        
                        s: 'Action', 
                        type: 'movie' 
                    }
                });

                if (response.data.Response === 'True' && response.data.Search) {
                   
                    setMovies(response.data.Search.slice(0, 8)); 
                } else {
                  
                    setError(response.data.Error || "No popular movies found. Try searching later.");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching OMDb data:", err);
                setError("Failed to fetch movies. Check your network or API key activation.");
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="light" />
                <p className="mt-2 text-light">Loading popular movies...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
    }
    
    
    return (
        <Container className="py-4"> 
            <h2 className="mb-4 text-center text-light">Popular Action Movies (OMDb)</h2>
            <Row xs={1} md={2} lg={4} className="g-4">
                {movies.map(movie => (
                    <Col key={movie.imdbID}> 
                        <Card className="h-100 shadow-sm" style={{ backgroundColor: 'var(--card-dark)', borderColor: 'var(--border-dark)' }}>
                            <Card.Img 
                                variant="top" 
                                src={movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'} 
                                alt={movie.Title} 
                                style={{ height: '350px', objectFit: 'cover' }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="fs-5 text-truncate" style={{ color: 'var(--text-light)' }}>
                                    {movie.Title}
                                </Card.Title>
                                <Card.Text className="text-muted">
                                    {movie.Year}
                                </Card.Text>
                                <Link 
                                    to={`/details/${movie.imdbID}`} 
                                    className="btn btn-primary mt-auto w-100"
                                >
                                    View Details & Reviews
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default HomePage;