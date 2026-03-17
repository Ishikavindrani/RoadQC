const mongoose = require('mongoose');

const RoadSegmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    project: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    lengthKm: { type: Number, required: true },
    requiredCheckpoints: { type: Number, required: true },
    status: { type: String, enum: ['planned', 'in-progress', 'completed'], default: 'planned' },
    gpsPath: [{
        lat: Number,
        lng: Number
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RoadSegment', RoadSegmentSchema);
