const express = require('express');
const { toggleWishlist, getWishlist, getUserProfile, updateUserProfile, getAllCustomers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, admin, getAllCustomers);
router.route('/wishlist').get(protect, getWishlist).post(protect, toggleWishlist);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
