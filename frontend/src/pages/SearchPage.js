import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, FormControl, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';


const OMDB_API_KEY = 'de9d2f7f'; 
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setSearchResults([]);

        if (searchTerm.trim() === '') {
            setError('Please enter a movie title to search.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(OMDB_BASE_URL, {
                params: {
                    apikey: OMDB_API_KEY,
                    s: searchTerm, 
                    type: 'movie'  
                }
            });

            if (response.data.Response === 'True') {
               
                setSearchResults(response.data.Search);
            } else {
                setError(response.data.Error || `No results found for "${searchTerm}"`);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching OMDb data:", err);
            setError("A network error occurred while searching.");
            setLoading(false);
        }
    };

    return (
        <div className="py-4">
            <h2 className="mb-4 text-center" style={{ color: 'var(--text-light)' }}>
                Search for Movies
            </h2>
            <Form onSubmit={handleSearch} className="mb-5 d-flex justify-content-center">
                <FormControl
                    type="search"
                    placeholder="Enter movie title (e.g., Inception)"
                    className="me-2"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '400px', backgroundColor: 'var(--card-dark)', color: 'var(--text-light)' }}
                />
                <Button variant="primary" type="submit">Search</Button>
            </Form>


            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="light" />
                </div>
            )}
            {error && <Alert variant="danger" className="mt-5 text-center">{error}</Alert>}
            <Row xs={1} md={2} lg={4} className="g-4">
                {searchResults.map(movie => (
                    <Col key={movie.imdbID}>
                        <Card className="h-100 shadow-sm transition-hover">
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
                                    to={`/movie/${movie.imdbID}`} 
                                    className="btn btn-primary mt-auto w-100"
                                >
                                    View Details
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SearchPage;