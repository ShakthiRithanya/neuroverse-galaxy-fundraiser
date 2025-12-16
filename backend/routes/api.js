import express from 'express';
import { Registration } from '../models/Registration.js';
import { Feedback } from '../models/Feedback.js';
import { Admin } from '../models/Admin.js';
import { Student } from '../models/Student.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', username: admin.username, role: 'admin' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Student Register
router.post('/student/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await Student.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        const student = new Student({ name, email, password });
        await student.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Student Login
router.post('/student/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });

        if (!student || student.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            user: { id: student._id, name: student.name, email: student.email },
            role: 'student'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Setup Initial Admin (One-time use or just manual)
router.post('/setup-admin', async (req, res) => {
    try {
        const exists = await Admin.findOne({ username: 'admin' });
        if (exists) return res.status(400).json({ message: 'Admin already exists' });

        const admin = new Admin({ username: 'admin', password: 'admin123' });
        await admin.save();
        res.json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating admin' });
    }
});

// Get all registrations (Admin)
router.get('/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create registration
router.post('/registrations', async (req, res) => {
    try {
        const newRegistration = new Registration(req.body);
        const savedRegistration = await newRegistration.save();
        res.status(201).json(savedRegistration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update payment status (Admin)
router.patch('/registrations/:id/payment', async (req, res) => {
    try {
        const { status } = req.body; // 'Paid' or 'Pending'
        const registration = await Registration.findByIdAndUpdate(
            req.params.id,
            { paymentStatus: status },
            { new: true }
        );
        res.json(registration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get feedback (Admin)
router.get('/feedback', async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit feedback
router.post('/feedback', async (req, res) => {
    try {
        const newFeedback = new Feedback(req.body);
        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete feedback (Admin)
router.delete('/feedback/:id', async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ message: 'Feedback deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const totalRegistrations = await Registration.countDocuments();
        const totalFeedback = await Feedback.countDocuments();

        // Quick aggregation for revenue (assuming flat fee or just summing paid ones)
        // For now assuming just count of Paid status
        const paidRegistrations = await Registration.countDocuments({ paymentStatus: 'Paid' });
        const totalRevenue = paidRegistrations * 100; // Mock 100 currency unit per reg

        res.json({
            totalRegistrations,
            totalFeedback,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
