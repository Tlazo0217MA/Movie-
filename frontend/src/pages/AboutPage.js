import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const AboutPage = () => {
    return (
        <Container className="py-5 text-light" style={{ maxWidth: '800px' }}>
            <h1 className="text-center mb-4">About the Movie Review Platform</h1>
            <p className="lead text-center text-muted mb-5">
                A full-stack application for reviewing and rating movies.
            </p>

            <Row className="g-4">
                <Col md={6}>
                    <Card style={{ backgroundColor: 'var(--card-dark)', color: 'var(--text-light)', minHeight: '100%' }}>
                        <Card.Body>
                            <Card.Title>Frontend Technology (React)</Card.Title>
                            <Card.Text>
                                The user interface is built using **React** with **React Router** for navigation and **Bootstrap** (via React-Bootstrap) for styling, ensuring a modern, responsive user experience.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card style={{ backgroundColor: 'var(--card-dark)', color: 'var(--text-light)', minHeight: '100%' }}>
                        <Card.Body>
                            <Card.Title>Backend & Database</Card.Title>
                            <Card.Text>
                                The server logic is powered by **Node.js** and **Express**, with **Firebase Authentication** securing user data. Reviews are stored in **Google Cloud Firestore**.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12}>
                    <Card style={{ backgroundColor: 'var(--card-dark)', color: 'var(--text-light)' }}>
                        <Card.Body>
                            <Card.Title>External Data</Card.Title>
                            <Card.Text>
                                All movie data, including titles, posters, and details, is fetched using the **OMDb API (The Open Movie Database)**.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutPage;