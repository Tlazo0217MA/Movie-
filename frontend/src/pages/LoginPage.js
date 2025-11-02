import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
                console.log("User registered and logged in successfully.");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                console.log("User logged in successfully.");
            }
            
            
            navigate('/'); 

        } catch (err) {
            console.error("Authentication Error:", err.code);
            if (err.code === 'auth/invalid-email') {
                setError('Invalid email address format.');
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Invalid credentials. Please check your email and password.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            }
            else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="shadow-lg" style={{ width: '22rem', backgroundColor: 'var(--card-dark)' }}>
                <Card.Body className="p-4">
                    <Card.Title className="text-center mb-4 fs-3">
                        {isRegistering ? 'Create an Account' : 'Sign In'}
                    </Card.Title>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="name@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ backgroundColor: '#2d2d2d', color: 'var(--text-light)' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ backgroundColor: '#2d2d2d', color: 'var(--text-light)' }}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-3">
                            {isRegistering ? 'Sign Up' : 'Log In'}
                        </Button>
                    </Form>
                    
                    <div className="text-center mt-3">
                        <small>
                            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                            <Button 
                                variant="link" 
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="p-0 ms-1 text-decoration-none"
                                style={{ color: 'var(--text-light)' }}
                            >
                                {isRegistering ? 'Log In' : 'Sign Up'}
                            </Button>
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LoginPage;