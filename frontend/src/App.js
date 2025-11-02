import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; 
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DetailsPage from './pages/DetailsPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/LoginPage';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage'; 

function App() {
    return (
       
        <BrowserRouter>
            <div className="App">
                
                <NavBar /> 
                
                
                <div className="container mt-4 mb-5">
                    <Routes>
                        
                        
                        <Route path="/" element={<HomePage />} />
                        
                       
                        <Route path="/search" element={<SearchPage />} />
                        
                       
                        <Route path="/details/:movieId" element={<DetailsPage />} />
                        
                        {/* Profile Page */}
                        <Route path="/profile/reviews" element={<ProfilePage />} />
                        
                        {/* Login/Auth Page */}
                        <Route path="/login" element={<AuthPage />} />
                            {/*about page */}
                        <Route path="/about" element={<AboutPage />} />
                        
                        {/* 404 Catch-all */}
                        <Route path="*" element={<h1 className="text-light text-center mt-5">404: Page Not Found</h1>} />
                    </Routes>
                </div>
                
                
                <Footer /> 
            </div>
        </BrowserRouter>
    );
}

export default App;