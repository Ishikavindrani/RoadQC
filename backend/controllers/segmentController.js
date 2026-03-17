const RoadSegment = require('../models/RoadSegment');

// @desc    Get all road segments
// @route   GET /api/segments
// @access  Private
exports.getSegments = async (req, res) => {
    const { district, state, status } = req.query;
    const filter = {};
    if (district) filter.district = district;
    if (state) filter.state = state;
    if (status) filter.status = status;

    try {
        const segments = await RoadSegment.find(filter);
        res.json(segments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a road segment
// @route   POST /api/segments
// @access  Private/Admin
exports.createSegment = async (req, res) => {
    try {
        const segment = new RoadSegment(req.body);
        const createdSegment = await segment.save();
        res.status(201).json(createdSegment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
