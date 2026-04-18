import express from 'express';
import { createIssue, getIssues, getIssueById, updateIssue, deleteIssue } from '../controllers/issueController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.route('/')
  .post(createIssue)
  .get(getIssues);

router.route('/:id')
  .get(getIssueById)
  .put(updateIssue)
  .delete(deleteIssue);

export default router;
