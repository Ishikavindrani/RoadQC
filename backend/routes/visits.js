const express = require('express');
const {
    startVisit,
    recordCheckpoint,
    endVisit,
    getMyVisits,
    getAllVisits
} = require('../controllers/visitController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, getMyVisits);
router.get('/', protect, authorize('admin'), getAllVisits);
router.post('/start', protect, startVisit);
router.post('/:id/checkpoint', protect, recordCheckpoint);
router.post('/:id/end', protect, endVisit);

module.exports = router;
