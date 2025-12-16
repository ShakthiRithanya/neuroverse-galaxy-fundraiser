import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Admin } from './models/Admin.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fundraising_event')
    .then(async () => {
        console.log('MongoDB Connected');

        const targetAdmin = {
            username: 'shakthirithanyasr07@gmail.com',
            password: 'Rithanya'
        };

        // Check if specific admin exists
        const exists = await Admin.findOne({ username: targetAdmin.username });
        if (exists) {
            console.log(`Admin ${targetAdmin.username} already exists`);
            // Update password to match request
            if (exists.password !== targetAdmin.password) {
                exists.password = targetAdmin.password;
                await exists.save();
                console.log('Password updated to match request');
            }
        } else {
            const admin = new Admin(targetAdmin);
            await admin.save();
            console.log(`Created admin: ${targetAdmin.username}`);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
