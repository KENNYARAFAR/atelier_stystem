import { Router, Response } from 'express';
import Inventory from '../models/Inventory';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Private
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const inventory = await Inventory.find({}).sort({ itemName: 1 });
    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/inventory
// @desc    Add new inventory item
// @access  Private
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  const { itemName, category, quantity, unit, minStock, supplier, cost } = req.body;

  try {
    const item = await Inventory.create({
      itemName,
      category,
      quantity,
      unit,
      minStock,
      supplier,
      cost,
    });
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/inventory/:id
// @desc    Update inventory item details
// @access  Private
router.patch('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
