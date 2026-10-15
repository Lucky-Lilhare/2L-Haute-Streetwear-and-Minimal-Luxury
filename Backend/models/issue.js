import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Issue / Problem Ticket Schema
 */
const issueSchema = new Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ['Order / Shipping', 'Website / UI Bug', 'Payment / Refund', 'Product Exchange', 'Other'],
        message: '{VALUE} is not a valid issue type',
      },
      default: 'Order / Shipping',
    },
    customerName: {
      type: String,
      required: [true, 'Customer or reporter name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    orderId: {
      type: String,
      trim: true,
      default: 'N/A',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Investigating', 'Resolved', 'Closed'],
      default: 'Pending',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

issueSchema.index({ status: 1, priority: 1, createdAt: -1 });

const Issue = mongoose.models.Issue || mongoose.model('Issue', issueSchema);

export default Issue;
export { Issue, issueSchema };
