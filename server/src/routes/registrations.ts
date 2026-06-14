import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import RegistrationRequest from '../models/RegistrationRequest';
import User from '../models/User';
import { protect, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// @route   GET /api/registrations
// @desc    Get all registration applications
// @access  Private/Admin
router.get('/', protect, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const requests = await RegistrationRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/registrations/:id/status
// @desc    Approve or reject a registration request
// @access  Private/Admin
router.patch('/:id/status', protect, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const request = await RegistrationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Registration request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been reviewed' });
    }

    request.status = status;
    request.reviewedAt = new Date();
    request.reviewedBy = req.user?.name || 'Admin';
    await request.save();

    // If approved, create the User account
    if (status === 'approved') {
      // Check if user already exists
      const userExists = await User.findOne({ email: request.email });
      if (!userExists) {
        const salt = await bcrypt.genSalt(10);
        // Default password is password123
        const hashedPassword = await bcrypt.hash('password123', salt);

        await User.create({
          name: request.name,
          email: request.email,
          password: hashedPassword,
          role: 'tailor',
          isActive: true,
        });
      }
    }

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
