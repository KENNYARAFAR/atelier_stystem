import mongoose, { Schema } from 'mongoose';

const InventorySchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['fabric', 'thread', 'button', 'zipper', 'other'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    minStock: {
      type: Number,
      required: true,
      min: 0,
    },
    supplier: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: 'lastUpdated' },
  }
);

InventorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

InventorySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: any) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Inventory = mongoose.model('Inventory', InventorySchema);
export default Inventory;
