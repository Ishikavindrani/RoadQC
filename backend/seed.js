const mongoose = require('mongoose');
const User = require('./models/User');
const RoadSegment = require('./models/RoadSegment');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roadqc');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany();
        await RoadSegment.deleteMany();

        // 1. Create Default Profiles (Admins & Operators)
        const users = [
            {
                name: 'Super Admin',
                email: 'admin@roadqc.gov.in',
                password: 'password123',
                role: 'admin'
            },
            {
                name: 'Anjali Sharma',
                email: 'anjali@roadqc.gov.in',
                password: 'password123',
                role: 'operator'
            },
            {
                name: 'Vikram Singh',
                email: 'vikram@roadqc.gov.in',
                password: 'password123',
                role: 'operator'
            }
        ];

        console.log('Seeding Users...');
        for (const u of users) {
            const newUser = new User(u);
            await newUser.save();
            console.log(`- Created ${u.role}: ${u.email}`);
        }

        // 2. Create Default Road Segments
        const segments = [
            {
                name: 'Delhi-Mumbai Expressway (Sec 1)',
                code: 'DME-01',
                project: 'Bharatmala Pariyojana',
                district: 'Gurugram',
                state: 'Haryana',
                lengthKm: 45.5,
                requiredCheckpoints: 20,
                status: 'in-progress'
            },
            {
                name: 'Yamuna Bypass Link',
                code: 'YBL-44',
                project: 'State Highway Expansion',
                district: 'Mathura',
                state: 'Uttar Pradesh',
                lengthKm: 12.8,
                requiredCheckpoints: 8,
                status: 'planned'
            },
            {
                name: 'Western Coastal Road',
                code: 'WCR-09',
                project: 'Coastal Infrastructure',
                district: 'Raigad',
                state: 'Maharashtra',
                lengthKm: 32.0,
                requiredCheckpoints: 15,
                status: 'completed'
            }
        ];

        console.log('Seeding Road Segments...');
        await RoadSegment.insertMany(segments);

        console.log('--- Seeding Complete ---');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
