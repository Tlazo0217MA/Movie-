import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth'; 
import { useAuth } from '../services/AuthContext'; 

const NavBar = () => {
    const { currentUser, loading } = useAuth();
    
    const isAuthenticated = !!currentUser; 
    
    const navigate = useNavigate();

   
    if (loading) {
        return null; 
    }

    const handleLogout = async () => {
        try {
            await signOut(getAuth());
            console.log("User logged out."); 
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" style={{ backgroundColor: 'var(--primary-black)' }}>
            <div className="container-fluid">
                <Link className="navbar-brand text-light" to="/">
                    🎬 Movie Review Platform
                </Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link text-light" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-light" to="/search">Search</Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link text-light" to="/about">About</Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-light" to="/profile/reviews">My Reviews</Link>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-outline-light ms-2" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-primary ms-2" to="/login">
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;