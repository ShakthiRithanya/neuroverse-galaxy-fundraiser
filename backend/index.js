import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;




// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Admin Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', username: admin.username, role: 'admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student Register
app.post('/api/student/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if exists
    const exists = await prisma.student.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    await prisma.student.create({
      data: { name, email, password }
    });
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unified Login (Student or Admin)
app.post('/api/student/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Frontend sends 'email' field, we treat it as username for admin

    // 1. Check if it's an Admin first
    const admin = await prisma.admin.findUnique({ where: { username: email } });
    if (admin && admin.password === password) {
      return res.json({
        message: 'Admin Login successful',
        username: admin.username,
        role: 'admin'
      });
    }

    // 2. If not admin, check Student
    const student = await prisma.student.findUnique({ where: { email } });

    if (!student || student.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: { id: student.id, name: student.name, email: student.email },
      role: 'student'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Registration (Simple, no payment integration)
app.post('/api/registrations', async (req, res) => {
  try {
    const {
      name, email, phone, rollNo, studentClass,
      stallId, stallName, amount
    } = req.body;

    // Create Registration in DB
    const registration = await prisma.registration.create({
      data: {
        name,
        email,
        phone,
        rollNo,
        studentClass,
        stallId,
        stallName,
        paymentStatus: 'Pending', // Default to Pending, admin can update
        amount: amount || 0
      }
    });

    res.status(201).json({
      registration,
      message: "Registration successful"
    });
  } catch (error) {
    console.error("Error creating registration:", error);
    res.status(400).json({ message: "Registration failed", error: error.message });
  }
});

// Get Registrations (Admin)
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Registration (Public - for payment status check)
app.get('/api/registrations/:id', async (req, res) => {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: req.params.id }
    });
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle Payment
app.patch('/api/registrations/:id/payment', async (req, res) => {
  try {
    const { status } = req.body;
    const registration = await prisma.registration.update({
      where: { id: req.params.id },
      data: { paymentStatus: status }
    });
    res.json(registration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    await prisma.registration.delete({ where: { id: req.params.id } });
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = await prisma.feedback.create({
      data: req.body
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/feedback/:id', async (req, res) => {
  try {
    await prisma.feedback.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalRegistrations = await prisma.registration.count();
    const totalFeedback = await prisma.feedback.count();
    const paidRegistrations = await prisma.registration.count({ where: { paymentStatus: 'Paid' } });

    res.json({
      totalRegistrations,
      totalFeedback,
      totalRevenue: paidRegistrations * 100
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// --- Event Settings (Stalls Reveal) ---

// Get Settings (Public)
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await prisma.eventSettings.findFirst();
    if (!settings) {
      settings = await prisma.eventSettings.create({
        data: {
          stall1Revealed: false,
          stall2Revealed: false,
          stall3Revealed: false
        }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Settings (Admin)
app.patch('/api/settings', async (req, res) => {
  try {
    const { stall1Revealed, stall2Revealed, stall3Revealed } = req.body;

    // Ensure one exists
    let settings = await prisma.eventSettings.findFirst();
    if (!settings) {
      settings = await prisma.eventSettings.create({
        data: {
          stall1Revealed: false,
          stall2Revealed: false,
          stall3Revealed: false
        }
      });
    }

    const updated = await prisma.eventSettings.update({
      where: { id: settings.id },
      data: {
        stall1Revealed: stall1Revealed !== undefined ? stall1Revealed : settings.stall1Revealed,
        stall2Revealed: stall2Revealed !== undefined ? stall2Revealed : settings.stall2Revealed,
        stall3Revealed: stall3Revealed !== undefined ? stall3Revealed : settings.stall3Revealed,
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Seed Admin on startup
  try {
    const targetAdmin = {
      username: 'shakthirithanyasr07@gmail.com',
      password: 'Rithanya'
    };

    const exists = await prisma.admin.findUnique({ where: { username: targetAdmin.username } });
    if (!exists) {
      await prisma.admin.create({ data: targetAdmin });
      console.log('Admin seeded successfully');
    } else {
      // Update password just in case
      if (exists.password !== targetAdmin.password) {
        await prisma.admin.update({
          where: { username: targetAdmin.username },
          data: { password: targetAdmin.password }
        });
        console.log('Admin password updated');
      }
    }
  } catch (e) {
    console.error('Seed error:', e);
  }
});
