const express = require('express');
const { translateText, translateBatch } = require('../controllers/translateController');

const router = express.Router();

router.post('/', translateText);
router.post('/batch', translateBatch);

module.exports = router;
