const express = require('express');
const { getRankings } = require('../controllers/rankingController');
const { validateRankingsQuery, handleValidationErrors } = require('../utils/validation');

const router = express.Router();

// GET /rankings with query parameters: year, region, subject, page, limit
router.get('/rankings', validateRankingsQuery, handleValidationErrors, getRankings);

module.exports = router;
