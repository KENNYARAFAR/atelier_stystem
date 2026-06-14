import { Router, Response } from 'express';
import Customer from '../models/Customer';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const customers = await Customer.find({}).sort({ name: 1 });
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/customers
// @desc    Add new customer
// @access  Private
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  const { name, email, phone, address, notes } = req.body;

  try {
    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      notes,
    });
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/customers/:id
// @desc    Update customer details
// @access  Private
router.patch('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    Object.assign(customer, req.body);
    await customer.save();
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
