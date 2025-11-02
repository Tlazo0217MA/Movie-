import axios from 'axios';
const BACKEND_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api'; 

const api = axios.create({
    baseURL: BACKEND_API_URL,
});

const OMDB_URL = 'http://www.omdbapi.com'; 
const OMDB_KEY = process.env.REACT_APP_OMDB_API_KEY; 

export const fetchMoviesBySearch = async (query) => {
    if (!OMDB_KEY) {
        console.error("OMDB API key is missing. Check your .env file.");
        throw new Error("OMDB API key is not configured.");
    }
    try {
        const response = await axios.get(
            `${OMDB_URL}/?apikey=${OMDB_KEY}&s=${query}&type=movie`
        );
        return response.data.Search || [];
    } catch (error) {
        console.error('Error fetching movies from OMDB:', error);
        throw error;
    }
};

export const fetchMovieDetails = async (imdbID) => {
    if (!OMDB_KEY) {
        console.error("OMDB API key is missing. Check your .env file.");
        throw new Error("OMDB API key is not configured.");
    }
    try {
        const response = await axios.get(
            `${OMDB_URL}/?apikey=${OMDB_KEY}&i=${imdbID}&plot=full`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details from OMDB:', error);
        throw error;
    }
};


export const fetchReviews = async (movieId) => {
    try {
        const response = await api.get(`/reviews/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};


export const fetchUserReviews = async (token) => {
    try {
        // This hits the new route you added to reviewRoutes.js
        const response = await api.get('/reviews/user/reviews', {
             headers: {
                 Authorization: `Bearer ${token}`
             }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        throw error;
    }
};


export const submitReview = async (reviewData, token) => {
    try {
        const response = await api.post('/reviews', reviewData, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting review:', error);
        throw error;
    }
};

export const updateReview = async (reviewId, updateData, token) => {
    try {
        const response = await api.put(`/reviews/${reviewId}`, updateData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating review ${reviewId}:`, error);
        throw error;
    }
};


export const deleteReview = async (reviewId, token) => {
    try {
        const response = await api.delete(`/reviews/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting review ${reviewId}:`, error);
        throw error;
    }
};

export const fetchAggregateRating = async (movieId) => {
    try {
        const response = await api.get(`/ratings/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching aggregate rating:', error);
        return { movieId: movieId, averageRating: 0, totalReviews: 0 }; 
    }
};