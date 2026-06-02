const express = require('express');
const { searchProducts, getDemandInsights, chatAssistant, getRecommendations, suggestProductsFromQuery } = require('../controllers/aiController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/search', searchProducts);
router.post('/recommendations', getRecommendations);
router.post('/suggest-products', suggestProductsFromQuery);
router.post('/chat', chatAssistant);
router.get('/demand', protect, admin, getDemandInsights);

module.exports = router;
