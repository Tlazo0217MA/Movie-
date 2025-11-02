const { db } = require('../config/firebaseConfig');
const { FieldValue } = require('firebase-admin/firestore');


const ratingsCollection = db.collection('ratings');


exports.createRating = async (req, res) => {
  try {
    const userId = req.user.uid; 
    const { itemId, itemType, rating } = req.body;

    if (!itemId || rating === undefined) {
      return res.status(400).send({ error: 'Missing required fields: itemId and rating.' });
    }

    
    const numericalRating = Number(rating);

  
    const newRating = await ratingsCollection.add({
      itemId,         
      userId,         
      itemType,       
      rating: numericalRating,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    res.status(201).send({ message: 'Rating created successfully', id: newRating.id });

  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).send({ error: 'Internal server error while creating rating.' });
  }
};


exports.getRatingsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    
    const snapshot = await ratingsCollection
      .where('itemId', '==', itemId)
      .orderBy('createdAt', 'desc')
      .get();
    
    if (snapshot.empty) {
      return res.status(200).send([]);
    }

    const ratings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).send(ratings);

  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).send({ error: 'Internal server error while fetching ratings.' });
  }
};


exports.updateRating = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { ratingId } = req.params;
    const { rating } = req.body;

    if (rating === undefined) {
      return res.status(400).send({ error: 'Missing required field for update: rating.' });
    }

    const ratingRef = ratingsCollection.doc(ratingId);
    const doc = await ratingRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Rating not found.' });
    }


    if (doc.data().userId !== userId) {
      return res.status(403).send({ error: 'Forbidden: You can only update your own ratings.' });
    }

    await ratingRef.update({
      rating: Number(rating),
      updatedAt: FieldValue.serverTimestamp(),
    });

    res.status(200).send({ message: 'Rating updated successfully.' });

  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).send({ error: 'Internal server error while updating rating.' });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { ratingId } = req.params;

    const ratingRef = ratingsCollection.doc(ratingId);
    const doc = await ratingRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Rating not found.' });
    }

  
    if (doc.data().userId !== userId) {
      return res.status(403).send({ error: 'Forbidden: You can only delete your own ratings.' });
    }

    await ratingRef.delete();

    res.status(200).send({ message: 'Rating deleted successfully.' });

  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).send({ error: 'Internal server error while deleting rating.' });
  }
};