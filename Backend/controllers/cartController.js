import Cart from '../models/cart.js';
import Product from '../models/product.js';

/**
 * @desc    Get user's cart with populated product details
 * @route   GET /api/cart
 * @access  Private (Authenticated User)
 */
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'items.productId',
      select: 'title price originalPrice images category sizes colors stockCount inStock',
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add item to cart or increment quantity
 * @route   POST /api/cart
 * @access  Private (Authenticated User)
 */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, selectedSize, selectedColor = 'Default' } = req.body;

    if (!productId || !selectedSize) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and selected size are required',
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Check if item already exists with matching size and color
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: Number(quantity),
        selectedSize,
        selectedColor,
      });
    }

    await cart.save();

    // Populate for response
    await cart.populate({
      path: 'items.productId',
      select: 'title price originalPrice images category sizes colors stockCount',
    });

    res.status(200).json({
      success: true,
      message: 'Item added to bag',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quantity of an item in cart
 * @route   PUT /api/cart/item
 * @access  Private (Authenticated User)
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId, quantity } = req.body;

    if (!itemId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Cart item ID and quantity are required',
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    if (Number(quantity) <= 0) {
      // Remove item if quantity set to 0
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();

    await cart.populate({
      path: 'items.productId',
      select: 'title price originalPrice images category stockCount',
    });

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove specific item from cart
 * @route   DELETE /api/cart/item/:itemId
 * @access  Private (Authenticated User)
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    await cart.populate({
      path: 'items.productId',
      select: 'title price originalPrice images category',
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all items from user cart
 * @route   DELETE /api/cart
 * @access  Private (Authenticated User)
 */
export const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    } else {
      cart.items = [];
    }
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart,
    });
  } catch (error) {
    next(error);
  }
};
