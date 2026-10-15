import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Cart Item Sub-document Schema
 */
const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    selectedSize: {
      type: String,
      required: [true, 'Selected size is required'],
      trim: true,
    },
    selectedColor: {
      type: String,
      trim: true,
      default: 'Default',
    },
  },
  { _id: true }
);

/**
 * Cart Schema Architecture
 */
const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for cart'],
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Virtual for calculating total quantity of items in the cart
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + (item.quantity || 0), 0);
});

// Configure JSON serialization to include virtuals
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
export { Cart, cartSchema, cartItemSchema };
