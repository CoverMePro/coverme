import express, { Router } from 'express';
import authGuard from '../../../utils/authenticate-user';
import sickController from '../../../controllers/sick';

const router: Router = express.Router();

router.post('/', authGuard, sickController.createSickRequest);

router.get('/:user', authGuard, sickController.getSickRequests);
router.get('/:id/approve', authGuard, sickController.approveSickRequest);
router.get('/:id/reject', authGuard, sickController.rejectSickRequest);
router.get('/:id/delete', authGuard, sickController.deleteSickRequest);

export default router;
