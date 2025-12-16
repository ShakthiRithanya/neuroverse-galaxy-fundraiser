import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    stallId: { type: String, required: true },
    stallName: { type: String }, // Optional redundancy for easier display
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

export const Registration = mongoose.model('Registration', registrationSchema);
