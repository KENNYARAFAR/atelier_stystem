import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db';
import User from './models/User';

// Route Imports
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import orderRoutes from './routes/orders';
import reportRoutes from './routes/reports';
import notificationRoutes from './routes/notifications';
import customerRoutes from './routes/customers';
import inventoryRoutes from './routes/inventory';
import registrationRoutes from './routes/registrations';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/registrations', registrationRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Tailor Management System API is running...');
});

// Database Seed Function
const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      await User.create([
        {
          name: 'Admin User',
          email: 'admin@tailoring.com',
          password: hashedPassword,
          role: 'admin',
          isActive: true,
        },
        {
          name: 'John Tailor',
          email: 'john@tailoring.com',
          password: hashedPassword,
          role: 'tailor',
          isActive: true,
        },
        {
          name: 'Sarah Seamstress',
          email: 'sarah@tailoring.com',
          password: hashedPassword,
          role: 'tailor',
          isActive: true,
        },
      ]);
      console.log('Database seeded with default user credentials (password: password123)');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Start Server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    await seedUsers();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
