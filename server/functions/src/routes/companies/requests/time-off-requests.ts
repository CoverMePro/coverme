import express, { Router } from 'express';
import authGuard from '../../../utils/authenticate-user';
import timeOffController from '../../../controllers/time-off';

const router: Router = express.Router();

router.post('/', authGuard, timeOffController.createTimeOffRequest);

router.get('/', authGuard, timeOffController.getAllTimeOffRequest);
router.get('/:user', authGuard, timeOffController.getUserTimeOffRequest);
router.get('/:id/approve', authGuard, timeOffController.approveTimeOffRequest);
router.get('/:id/reject', authGuard, timeOffController.rejectTimeOffRequest);
router.get('/:id/delete', authGuard, timeOffController.deleteTimeOffRequest);

export default router;
