import bcrypt from 'bcryptjs';
import User from '../models/user.js';

/**
 * @desc    Update user profile details
 * @route   PUT /api/users/profile
 * @access  Private (Authenticated User)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.phone !== undefined) user.phone = req.body.phone.trim();

    // If updating password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add or manage saved delivery addresses
 * @route   POST /api/users/addresses
 * @access  Private (Authenticated User)
 */
export const addAddress = async (req, res, next) => {
  try {
    const { street, city, state, pincode, isDefault } = req.body;

    if (!street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide street, city, state, and 6-digit PIN code',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If new address is set as default, reset other addresses
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // If first address, automatically make it default
    const shouldBeDefault = isDefault || user.addresses.length === 0;

    user.addresses.push({
      street,
      city,
      state,
      pincode,
      isDefault: shouldBeDefault,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Delivery address added successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a delivery address by sub-document ID
 * @route   DELETE /api/users/addresses/:addressId
 * @access  Private (Authenticated User)
 */
export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const addressIndex = user.addresses.findIndex(
      (a) => a._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If the removed address was default and other addresses exist, set first as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address removed successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};
