const express = require('express');
const router = express.Router();

const ratingController = require('../controllers/ratingController');
const verifyToken = require('../middleware/authMiddleware');



router.get('/:itemId', ratingController.getRatingsByItem);


router.post('/', verifyToken, ratingController.createRating);


router.put('/:ratingId', verifyToken, ratingController.updateRating);


router.delete('/:ratingId', verifyToken, ratingController.deleteRating);


module.exports = router;