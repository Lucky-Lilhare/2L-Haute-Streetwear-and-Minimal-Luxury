import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Order Item Sub-document Schema
 */
const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
      trim: true,
    },
    color: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: true }
);

/**
 * Order Shipping Address Sub-document Schema
 */
const orderShippingAddressSchema = new Schema(
  {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'PIN code is required'],
      trim: true,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian PIN code'],
    },
    phone: {
      type: String,
      required: [true, 'Recipient phone number is required'],
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Order Schema Architecture
 */
const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for placing an order'],
      index: true,
    },
    orderItems: {
      type: [orderItemSchema],
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'Order must contain at least one item',
      },
      required: true,
    },
    shippingAddress: {
      type: orderShippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['UPI', 'Card', 'NetBanking', 'COD'],
        message: '{VALUE} is not an accepted payment method',
      },
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Paid', 'Failed'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'Pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'Pending',
      index: true,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total order price is required'],
      min: [0, 'Total price cannot be negative'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for fast querying of orders by user and date
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

// Virtual for item count
orderSchema.virtual('totalQuantity').get(function () {
  return this.orderItems ? this.orderItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
});

// Configure JSON serialization to include virtuals
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
export { Order, orderSchema, orderItemSchema, orderShippingAddressSchema };
