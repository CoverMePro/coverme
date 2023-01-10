import express, { Router } from 'express';
import authGuard from '../../utils/authenticate-user';
import shiftController from '../../controllers/shifts';

const router: Router = express.Router({ mergeParams: true });

router.get('/', authGuard, shiftController.getShiftRotations);
router.get('/:id/delete', authGuard, shiftController.deleteShiftRotation);

router.post('/', authGuard, shiftController.createShiftRotation);

export default router;
