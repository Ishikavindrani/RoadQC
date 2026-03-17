const express = require('express');
const { getSegments, createSegment } = require('../controllers/segmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getSegments)
    .post(protect, authorize('admin'), createSegment);

module.exports = router;
