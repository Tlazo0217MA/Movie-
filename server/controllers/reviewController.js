const { db } = require('../config/firebaseConfig');
const { FieldValue } = require('firebase-admin/firestore');

const reviewsCollection = db.collection('reviews');

exports.getUserReviews = async (req, res) => {
    const userId = req.user.uid; 
    
    try {
        const snapshot = await reviewsCollection
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            return res.status(200).send([]); 
        }

        const reviews = snapshot.docs.map(doc => ({
            id: doc.id,

            rating: doc.data().rating, 
            text: doc.data().reviewText,
            itemId: doc.data().movieId,

            ...doc.data() 
        }));

        res.status(200).send(reviews);

    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).send({ error: 'Internal server error while fetching user reviews.' });
    }
};

// --- 2. Create Review (No changes needed) ---
exports.createReview = async (req, res) => {
    try {
        const userId = req.user.uid; 
        
        const { 
            movieId,      
            movieTitle,   
            rating,       
            reviewText,   
            userName      
        } = req.body;

        if (!movieId || !reviewText || rating === undefined) {
            return res.status(400).send({ error: 'Missing required fields: movieId, rating, and reviewText.' });
        }

        const newReview = await reviewsCollection.add({
            movieId, 
            movieTitle,
            rating: parseInt(rating),
            reviewText,
            userName,
            userId,       
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        res.status(201).send({ message: 'Review created successfully', id: newReview.id });

    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).send({ error: 'Internal server error while creating review.' });
    }
};

exports.getReviewsByItem = async (req, res) => {
    try {
        const movieId = req.params.itemId;

        const snapshot = await reviewsCollection
            .where('movieId', '==', movieId)
            .orderBy('createdAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            return res.status(200).send([]);
        }

        const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            rating: doc.data().rating,
            text: doc.data().reviewText, 
            itemId: doc.data().movieId,
            ...doc.data()
        }));

        res.status(200).send(reviews);

    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send({ error: 'Internal server error while fetching reviews.' });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { reviewId } = req.params;
        const { reviewText, rating } = req.body; 

        if (!reviewText && rating === undefined) {
            return res.status(400).send({ error: 'Missing required field for update: reviewText or rating.' });
        }
        
        const reviewRef = reviewsCollection.doc(reviewId);
        const doc = await reviewRef.get();

        if (!doc.exists) {
            return res.status(404).send({ error: 'Review not found.' });
        }

        if (doc.data().userId !== userId) {
            return res.status(403).send({ error: 'Forbidden: You can only update your own reviews.' });
        }
        
        const updateData = {};
        if (reviewText !== undefined) updateData.reviewText = reviewText;
        if (rating !== undefined) updateData.rating = parseInt(rating); 

        updateData.updatedAt = FieldValue.serverTimestamp();

        await reviewRef.update(updateData);

        res.status(200).send({ message: 'Review updated successfully.' });

    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).send({ error: 'Internal server error while updating review.' });
    }
};

// --- 5. Delete Review (No changes needed) ---
exports.deleteReview = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { reviewId } = req.params;

        const reviewRef = reviewsCollection.doc(reviewId);
        const doc = await reviewRef.get();

        if (!doc.exists) {
            return res.status(404).send({ error: 'Review not found.' });
        }

        if (doc.data().userId !== userId) {
            return res.status(403).send({ error: 'Forbidden: You can only delete your own reviews.' });
        }

        await reviewRef.delete();

        res.status(200).send({ message: 'Review deleted successfully.' });

    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send({ error: 'Internal server error while deleting review.' });
    }
};