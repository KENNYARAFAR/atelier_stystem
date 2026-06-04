import { Router, Response } from 'express';
import DailyReport from '../models/DailyReport.js';
import Order from '../models/Order.js';
import { protect, AuthRequest } from '../middleware/auth.js';

const router = Router();

// @route   GET /api/reports
// @desc    Get reports (Admins see all, tailors see only theirs)
// @access  Private
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    let reports;
    if (req.user && req.user.role === 'admin') {
      reports = await DailyReport.find({}).sort({ createdAt: -1 });
    } else {
      reports = await DailyReport.find({ userId: req.user?._id }).sort({ createdAt: -1 });
    }
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reports
// @desc    Create a new report
// @access  Private
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  const { orderId, progress, workDone, challenges, estimatedCompletion, date } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user && req.user.role !== 'admin' && order.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to report progress on this order' });
    }

    const report = await DailyReport.create({
      userId: req.user?._id,
      userName: req.user?.name,
      orderId,
      orderTitle: `${order.garmentType} for ${order.customerName}`,
      progress,
      workDone,
      challenges,
      estimatedCompletion,
      date,
    });

    // Automatically update order progress / status if progress reaches 100% or update order status as well if desired
    if (progress === 100) {
      order.status = 'completed';
    } else if (order.status === 'pending') {
      order.status = 'in-progress';
    }
    await order.save();

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
