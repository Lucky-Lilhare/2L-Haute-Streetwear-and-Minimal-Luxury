import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  bulkCreateProducts,
} from '../controllers/productController.js';
import { protect, hostAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(hostAuth, createProduct);

router.post('/bulk', hostAuth, bulkCreateProducts);

router.route('/:id')
  .get(getProductById)
  .put(hostAuth, updateProduct)
  .delete(hostAuth, deleteProduct);

router.route('/:id/reviews')
  .post(protect, addReview);

export default router;
