import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import RegistrationRequest from '../models/RegistrationRequest';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jwt_secret_default_key_12345', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await (user as any).matchPassword(password))) {
      if (!user.isActive) {
        return res.status(401).json({ message: 'User account is deactivated' });
      }

      res.json({
        token: generateToken(user._id.toHexString()),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @route   POST /api/auth/register
// @desc    Submit a registration application
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, phone, experience, specialization, message } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const pendingRequest = await RegistrationRequest.findOne({ email, status: 'pending' });
    if (pendingRequest) {
      return res.status(400).json({ message: 'A registration request is already pending for this email' });
    }

    const request = await RegistrationRequest.create({
      name,
      email,
      phone,
      experience,
      specialization,
      message,
      status: 'pending',
    });

    res.status(201).json({ message: 'Application submitted successfully', id: request.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration request' });
  }
});

export default router;
