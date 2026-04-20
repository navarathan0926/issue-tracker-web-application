import { Router } from 'express';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getIssueStatsByStatus,
  exportIssues,
} from '../controllers/issueController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router: Router = Router();

router.use(authenticate);

router.route('/').post(createIssue).get(getIssues);

router.route('/stats').get(getIssueStatsByStatus);

router.route('/export').get(exportIssues);

router.route('/:id').get(getIssueById).put(updateIssue).delete(deleteIssue);

export default router;
