import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const resetAdminPassword = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/tailor_system';
    console.log(`Connecting to database: ${connStr}`);
    await mongoose.connect(connStr);
    
    const email = 'admin@tailoring.com';
    const newPassword = 'password123';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    let user = await User.findOne({ email });
    
    if (user) {
      user.password = hashedPassword;
      user.isActive = true;
      user.role = 'admin';
      await user.save();
      console.log(`Successfully reset password for existing admin: ${email} -> ${newPassword}`);
    } else {
      user = await User.create({
        name: 'Admin User',
        email,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      console.log(`Admin user did not exist. Successfully created new admin: ${email} -> ${newPassword}`);
    }
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

resetAdminPassword();
