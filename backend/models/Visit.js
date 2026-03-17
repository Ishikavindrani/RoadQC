const mongoose = require('mongoose');

const CheckpointSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    photoUrl: String,
    notes: String,
    timestamp: { type: Date, default: Date.now }
});

const VisitSchema = new mongoose.Schema({
    officer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roadSegment: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadSegment', required: true },
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    checkpoints: [CheckpointSchema],
    gpsTrace: [{
        lat: Number,
        lng: Number,
        timestamp: { type: Date, default: Date.now }
    }],
    coverage: { type: Number, default: 0 },
    clusterScore: { type: Number, default: 0 },
    isSuspicious: { type: Boolean, default: false },
    reasons: [String],
    notes: String,
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

module.exports = mongoose.model('Visit', VisitSchema);
