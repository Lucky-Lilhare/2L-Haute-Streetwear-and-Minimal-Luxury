import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder);

router.get('/myorders', getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.put('/:id/status', adminOnly, updateOrderStatus);

export default router;
