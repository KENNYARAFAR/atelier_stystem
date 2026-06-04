import mongoose, { Schema } from 'mongoose';

const RegistrationRequestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

RegistrationRequestSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

RegistrationRequestSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: any) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const RegistrationRequest = mongoose.model('RegistrationRequest', RegistrationRequestSchema);
export default RegistrationRequest;
export type IRegistrationRequest = mongoose.Document & {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  specialization: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: Date;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
};
