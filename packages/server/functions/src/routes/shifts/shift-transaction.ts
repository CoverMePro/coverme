import express, { Router } from 'express';
import authGuard from '../../utils/authenticate-user';
import shiftController from '../../controllers/shifts';

const router: Router = express.Router({ mergeParams: true });

router.post('/', authGuard, shiftController.transactionShifts);

export default router;
