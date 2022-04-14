import express, { Router } from 'express';
import authGuard from '../../../utils/authenticate-user';
import shiftController from '../../../controllers/shift';

const router: Router = express.Router();

router.post('/', authGuard, shiftController.transactionShifts);

export default router;
