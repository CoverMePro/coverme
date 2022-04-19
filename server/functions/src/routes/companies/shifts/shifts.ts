import express, { Router } from 'express';
import authGuard from '../../../utils/authenticate-user';
import shiftController from '../../../controllers/shift';

const router: Router = express.Router({ mergeParams: true });

router.get('/', authGuard, shiftController.getShiftsAndStaff);
router.get('/:user', authGuard, shiftController.getShiftForUser);
router.get('/:user/today', authGuard, shiftController.getShiftsFromTodayOnward);

router.post('/:user/range', authGuard, shiftController.getShiftsFromDateRange);

export default router;
