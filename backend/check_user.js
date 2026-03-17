const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roadqc');
        const user = await User.findOne({ email: 'anjali@roadqc.gov.in' });
        if (user) {
            console.log('User Found:', JSON.stringify(user, null, 2));
        } else {
            console.log('User NOT Found');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
checkUser();
