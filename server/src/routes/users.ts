import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// @route   GET /api/users
// @desc    Get all users (filtered to hide admin users, showing tailors only)
// @access  Private/Admin
router.get('/', protect, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Hide all admin users from the user management listing
    const users = await User.find({ role: 'tailor' }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/tailors
// @desc    Get all active tailors (for order assignment)
// @access  Private
router.get('/tailors', protect, async (req: AuthRequest, res: Response) => {
  try {
    // Return only active tailors. Admins are excluded (hidden) from tailors list
    const tailors = await User.find({ role: 'tailor', isActive: true }).sort({ name: 1 });
    res.json(tailors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users
// @desc    Add a new user (forced to 'tailor' role, hiding admin creation)
// @access  Private/Admin
router.post('/', protect, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Enforce role is always 'tailor' or block non-admin creation
    const userRole = role === 'admin' ? 'admin' : 'tailor'; 
    // Wait, the client can create tailors. We can allow admins to create tailors only, or admins.
    // If we make admin hidden, we enforce tailor role here or keep it. Let's allow creating tailors.
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      isActive: true,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/me/password
// @desc    Update current user password
// @access  Private
router.put('/me/password', protect, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await (user as any).matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/users/:id/status
// @desc    Toggle user active/inactive status
// @access  Private/Admin
router.patch('/:id/status', protect, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Do not allow toggling admin status from here to protect it
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot modify admin status' });
    }

    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', protect, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
