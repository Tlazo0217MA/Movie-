const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/authMiddleware');
router.get('/user/reviews', verifyToken, reviewController.getUserReviews);
router.get('/:itemId', reviewController.getReviewsByItem);


router.post('/', verifyToken, reviewController.createReview);
router.put('/:reviewId', verifyToken, reviewController.updateReview);
router.delete('/:reviewId', verifyToken, reviewController.deleteReview);

module.exports = router;