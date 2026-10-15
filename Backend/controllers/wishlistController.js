import Wishlist from '../models/wishlist.js';
import Product from '../models/product.js';

/**
 * @desc    Get user's wishlist populated with product details
 * @route   GET /api/wishlist
 * @access  Private (Authenticated User)
 */
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate({
      path: 'products',
      select: 'title price originalPrice images category stockCount inStock',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist
 * @access  Private (Authenticated User)
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, products: [] });
    }

    const exists = wishlist.products.some(
      (pId) => pId.toString() === productId
    );

    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate({
      path: 'products',
      select: 'title price originalPrice images category inStock',
    });

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private (Authenticated User)
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.products = wishlist.products.filter(
      (pId) => pId.toString() !== productId
    );

    await wishlist.save();

    await wishlist.populate({
      path: 'products',
      select: 'title price originalPrice images category inStock',
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};
