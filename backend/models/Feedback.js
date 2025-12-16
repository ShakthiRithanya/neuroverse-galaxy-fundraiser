import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);
