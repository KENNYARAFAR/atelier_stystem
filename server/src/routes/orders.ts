import { Router, Response } from 'express';
import Order from '../models/Order';
import Notification from '../models/Notification';
import User from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// @route   GET /api/orders
// @desc    Get orders (Admins get all, Tailors get their assigned orders only)
// @access  Private
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    let orders;
    if (req.user && req.user.role === 'admin') {
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ assignedTo: req.user?._id }).sort({ createdAt: -1 });
    }
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order (Admins only)
// @access  Private
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  const { customerName, garmentType, fabricType, measurements, style, instructions, assignedTo, dueDate } = req.body;

  try {
    // Look up tailor name
    const tailor = await User.findById(assignedTo);
    if (!tailor) {
      return res.status(404).json({ message: 'Assigned tailor not found' });
    }

    const order = await Order.create({
      customerName,
      garmentType,
      fabricType,
      measurements,
      style,
      instructions,
      assignedTo,
      assignedToName: tailor.name,
      dueDate,
      status: 'pending',
    });

    // Create a notification for the tailor
    await Notification.create({
      userId: assignedTo,
      title: 'New Order Assigned',
      message: `You have been assigned a new ${garmentType} order for ${customerName}`,
      type: 'info',
      isRead: false,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.patch('/:id/status', protect, async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify ownership if not admin
    if (req.user && req.user.role !== 'admin' && order.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this order' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/orders/:id
// @desc    Update order details
// @access  Private
router.patch('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify authorization (only admins can modify details, tailors can modify status only)
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can modify order details' });
    }

    if (req.body.assignedTo && req.body.assignedTo !== order.assignedTo.toString()) {
      const tailor = await User.findById(req.body.assignedTo);
      if (!tailor) {
        return res.status(404).json({ message: 'Assigned tailor not found' });
      }
      order.assignedTo = req.body.assignedTo;
      order.assignedToName = tailor.name;

      // Notify new tailor
      await Notification.create({
        userId: req.body.assignedTo,
        title: 'New Order Assigned',
        message: `You have been assigned a new ${req.body.garmentType || order.garmentType} order for ${req.body.customerName || order.customerName}`,
        type: 'info',
        isRead: false,
      });
    }

    Object.assign(order, req.body);
    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
