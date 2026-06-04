import mongoose, { Schema } from 'mongoose';

const DailyReportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    orderTitle: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    workDone: {
      type: String,
      required: true,
    },
    challenges: {
      type: String,
      default: '',
    },
    estimatedCompletion: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

DailyReportSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

DailyReportSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: any) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const DailyReport = mongoose.model('DailyReport', DailyReportSchema);
export default DailyReport;
