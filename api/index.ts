import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Models
import User from '../server/src/models/User';

// Route Imports
import authRoutes from '../server/src/routes/auth';
import userRoutes from '../server/src/routes/users';
import orderRoutes from '../server/src/routes/orders';
import reportRoutes from '../server/src/routes/reports';
import notificationRoutes from '../server/src/routes/notifications';
import customerRoutes from '../server/src/routes/customers';
import inventoryRoutes from '../server/src/routes/inventory';
import registrationRoutes from '../server/src/routes/registrations';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Database connection helper for serverless environment
const ATLAS_URI = 'mongodb+srv://kennyarafatt_db_user:zN5e1Q8eZziyFjhj@cluster0.rdotdpi.mongodb.net/tailor_system?appName=Cluster0';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const connStr = process.env.MONGODB_URI || ATLAS_URI;
  await mongoose.connect(connStr);
};

// Seed function to ensure the admin user exists
const seedUsers = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin2026', salt);

    await User.create([
      {
        name: 'Admin User',
        email: 'admin@tailoring.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      }
    ]);
    console.log('Database seeded with admin user');
  }
};

// Middleware to connect to DB and seed on each invocation
app.use(async (req, res, next) => {
  try {
    await connectDB();
    await seedUsers();
    next();
  } catch (error) {
    console.error('Database connection error in serverless function:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/registrations', registrationRoutes);

// Root test route
app.get('/api', (req, res) => {
  res.send('Tailor Management System API is running...');
});

export default app;
