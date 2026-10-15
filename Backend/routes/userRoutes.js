import express from 'express';
import {
  updateProfile,
  addAddress,
  deleteAddress,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth protection to all user routes
router.use(protect);

router.put('/profile', updateProfile);
router.post('/addresses', addAddress);
router.delete('/addresses/:addressId', deleteAddress);

export default router;
