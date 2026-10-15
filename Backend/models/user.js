import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Address Sub-document Schema
 */
const addressSchema = new Schema(
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
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

/**
 * User Schema Architecture
 */
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required (hashed)'],
      minlength: [6, 'Hashed password string must be valid'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'admin'],
        message: 'Role must be either customer or admin',
      },
      default: 'customer',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook to ensure only one default address exists
userSchema.pre('save', function () {
  if (this.isModified('addresses') && this.addresses && this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter((addr) => addr.isDefault);
    if (defaultAddresses.length > 1) {
      let foundFirst = false;
      this.addresses.forEach((addr) => {
        if (addr.isDefault) {
          if (!foundFirst) {
            foundFirst = true;
          } else {
            addr.isDefault = false;
          }
        }
      });
    }
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
export { User, userSchema, addressSchema };
