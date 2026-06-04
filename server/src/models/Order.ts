import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    garmentType: {
      type: String,
      required: true,
      trim: true,
    },
    fabricType: {
      type: String,
      required: true,
      trim: true,
    },
    measurements: {
      type: Schema.Types.Mixed,
      default: {},
    },
    style: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedToName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

OrderSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: any) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
