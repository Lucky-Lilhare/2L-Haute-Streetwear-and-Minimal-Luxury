import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Wishlist Schema Architecture
 */
const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for wishlist'],
      unique: true,
      index: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Virtual to get total count of wishlisted pieces
wishlistSchema.virtual('itemCount').get(function () {
  return this.products ? this.products.length : 0;
});

// Configure JSON serialization to include virtuals
wishlistSchema.set('toJSON', { virtuals: true });
wishlistSchema.set('toObject', { virtuals: true });

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
export { Wishlist, wishlistSchema };
