import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-dark text-white-50" 
            style={{ 
                backgroundColor: 'var(--primary-black)', 
                borderTop: '1px solid var(--border-dark)' 
            }}
        >
            <Container className="text-center">
                <small>
                    &copy; {new Date().getFullYear()} Movie Review Platform. Data provided by OMDb.
                </small>
            </Container>
        </footer>
    );
};

export default Footer;