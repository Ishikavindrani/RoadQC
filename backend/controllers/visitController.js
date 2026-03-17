const Visit = require('../models/Visit');
const RoadSegment = require('../models/RoadSegment');
const { getDistanceFromLatLonInKm } = require('../utils/haversine');

// @desc    Start a new inspection visit
// @route   POST /api/visits/start
// @access  Private/Operator
exports.startVisit = async (req, res) => {
    const { roadSegmentId, startLat, startLng } = req.body;
    try {
        // Guard: One open visit per segment per officer
        const activeVisit = await Visit.findOne({
            officer: req.user._id,
            roadSegment: roadSegmentId,
            status: 'active'
        });
        if (activeVisit) return res.status(400).json({ message: 'You already have an active visit for this segment' });

        const visit = await Visit.create({
            officer: req.user._id,
            roadSegment: roadSegmentId,
            gpsTrace: startLat ? [{ lat: startLat, lng: startLng }] : []
        });
        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Record a checkpoint
// @route   POST /api/visits/:id/checkpoint
// @access  Private/Operator
exports.recordCheckpoint = async (req, res) => {
    const { lat, lng, photoUrl, notes } = req.body;
    try {
        const visit = await Visit.findById(req.params.id);
        if (!visit) return res.status(404).json({ message: 'Visit not found' });

        // Ownership guard
        if (visit.officer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized: You are not the owner of this visit' });
        }

        visit.checkpoints.push({ lat, lng, photoUrl, notes });
        visit.gpsTrace.push({ lat, lng });
        await visit.save();
        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    End a visit and run Fraud Detection
// @route   POST /api/visits/:id/end
// @access  Private/Operator
exports.endVisit = async (req, res) => {
    const { notes } = req.body;
    try {
        const visit = await Visit.findById(req.params.id).populate('roadSegment');
        if (!visit) return res.status(404).json({ message: 'Visit not found' });

        if (visit.officer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        visit.endTime = new Date();
        visit.notes = notes;
        visit.status = 'completed';

        // --- FRAUD DETECTION ENGINE ---
        const reasons = [];

        // 1. Coverage Calculation (80m dedupe)
        const uniqueCheckpoints = [];
        visit.checkpoints.forEach(cp => {
            const isDuplicate = uniqueCheckpoints.some(ucp =>
                getDistanceFromLatLonInKm(cp.lat, cp.lng, ucp.lat, ucp.lng) < 0.08
            );
            if (!isDuplicate) uniqueCheckpoints.push(cp);
        });

        const required = visit.roadSegment.requiredCheckpoints || 5;
        const coverage = (uniqueCheckpoints.length / required) * 100;
        visit.coverage = Math.min(coverage, 100);

        if (coverage < 60) {
            reasons.push(`Low coverage: ${Math.round(coverage)}% (Min 60% required)`);
        }

        // 2. Cluster Score (Simple variance-based check)
        // If all points are too close together relative to total count
        if (uniqueCheckpoints.length > 1) {
            let totalDist = 0;
            uniqueCheckpoints.forEach((cp, i) => {
                if (i === 0) return;
                totalDist += getDistanceFromLatLonInKm(cp.lat, cp.lng, uniqueCheckpoints[i - 1].lat, uniqueCheckpoints[i - 1].lng);
            });
            const avgDist = totalDist / (uniqueCheckpoints.length - 1);
            if (avgDist < 0.1) { // If avg distance between unique points is < 100m
                visit.clusterScore = 0.8;
                reasons.push('High clustering: Checkpoints are too close to each other.');
            }
        }

        // 3. Speed Check (5 points in < 5 mins)
        const durationMins = (visit.endTime - visit.startTime) / 60000;
        if (uniqueCheckpoints.length >= 5 && durationMins < 5) {
            reasons.push('Speed violation: Multiple unique checkpoints recorded too quickly.');
        }

        // 4. Note Quality
        if (!notes || notes.length < 30) {
            reasons.push('Documentation alert: Completion notes are insufficient (min 30 chars).');
        }

        if (reasons.length > 0) {
            visit.isSuspicious = true;
            visit.reasons = reasons;
        }

        await visit.save();
        res.json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get visit history
// @route   GET /api/visits/my
// @access  Private/Operator
exports.getMyVisits = async (req, res) => {
    try {
        const visits = await Visit.find({ officer: req.user._id }).populate('roadSegment').sort('-startTime');
        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all visits (Admin dashboard)
// @route   GET /api/visits
// @access  Private/Admin
exports.getAllVisits = async (req, res) => {
    const { onlySuspicious } = req.query;
    const filter = {};
    if (onlySuspicious === 'true') filter.isSuspicious = true;

    try {
        const visits = await Visit.find(filter).populate('officer').populate('roadSegment').sort('-startTime');
        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
