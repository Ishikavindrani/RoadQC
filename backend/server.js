const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/roadqc';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const segmentRoutes = require('./routes/segments');
const visitRoutes = require('./routes/visits');

app.use('/api/auth', authRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/visits', visitRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'RoadQC Backend Running', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
