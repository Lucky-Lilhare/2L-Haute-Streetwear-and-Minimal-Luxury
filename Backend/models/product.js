import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Review Sub-document Schema
 */
const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for review'],
    },
    name: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

/**
 * Product Schema Architecture
 */
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [180, 'Title cannot exceed 180 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Men', 'Women', 'Jeans', 'T-Shirts', 'Shirts', 'Sneakers', 'PlusSize'],
        message: '{VALUE} is not a valid 2L clothing category',
      },
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be greater than or equal to 0'],
      validate: {
        validator: function (val) {
          return val === undefined || val === null || val >= this.price;
        },
        message: 'Original price ({VALUE}) should be greater than or equal to current price',
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'Product must have at least one image URL',
      },
      default: [],
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    colors: {
      type: [String],
      default: [],
    },
    stockCount: {
      type: Number,
      required: [true, 'Stock count is required'],
      default: 0,
      min: [0, 'Stock count cannot be negative'],
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be lower than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, 'Number of reviews cannot be negative'],
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for fast querying, filtering, and full-text search
productSchema.index({ category: 1, price: 1 });
productSchema.index({ title: 'text', description: 'text' });

// Virtual to check if product is currently in stock
productSchema.virtual('inStock').get(function () {
  return this.stockCount > 0;
});

// Virtual to calculate discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Configure JSON serialization to include virtuals
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
export { Product, productSchema, reviewSchema };
