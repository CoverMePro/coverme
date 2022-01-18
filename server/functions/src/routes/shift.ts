import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import shiftController from '../controller/shift';

const router: Router = express.Router();

// POST
router.post('/from-teams', authGuard, shiftController.getStaffandShiftsFromTeams);
router.post('/transactions', authGuard, shiftController.transactionShifts);

export default router;
