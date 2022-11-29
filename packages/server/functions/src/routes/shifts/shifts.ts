import express, { Router } from 'express';
import authGuard from '../../utils/authenticate-user';
import shiftController from '../../controllers/shifts';

const router: Router = express.Router({ mergeParams: true });

router.get('/', authGuard, shiftController.getShiftsAndStaffFromCompany);
router.get('/:user', authGuard, shiftController.getShiftFromUser);
router.get('/:user/today', authGuard, shiftController.getShiftsFromTodayOnward);

router.post('/:user/range', authGuard, shiftController.getShiftsFromDateRange);

export default router;
