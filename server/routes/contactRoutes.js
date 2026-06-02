const express = require('express');
const { submitContactForm, requestRestock } = require('../controllers/contactController');

const router = express.Router();

router.post('/', submitContactForm);
router.post('/restock', requestRestock);

module.exports = router;
