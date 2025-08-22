const express = require('express');
const { getRankings } = require('../controllers/rankingController');

const router = express.Router();

// GET /rankings with query parameters: year, region, page, limit
router.get('/rankings', getRankings);

module.exports = router;
