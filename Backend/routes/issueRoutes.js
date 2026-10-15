import express from 'express';
import {
  getIssues,
  createIssue,
  getIssueById,
  updateIssue,
  deleteIssue,
} from '../controllers/issueController.js';
import { hostAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getIssues)
  .post(createIssue);

router.route('/:id')
  .get(getIssueById)
  .put(hostAuth, updateIssue)
  .delete(hostAuth, deleteIssue);

export default router;
