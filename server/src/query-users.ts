import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const queryUsers = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/tailor_system';
    console.log(`Connecting to database: ${connStr}`);
    await mongoose.connect(connStr);
    
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, IsActive: ${u.isActive}`);
    });
  } catch (error) {
    console.error('Error querying users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

queryUsers();
