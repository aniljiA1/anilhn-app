const express = require('express');
const router = express.Router();
const { triggerScrape } = require('../controllers/scraperController');

router.post('/', triggerScrape);

module.exports = router;
