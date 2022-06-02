import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import overtimeCalloutController from '../controllers/overtime-callout';

const router: Router = express.Router();

router.get('/:company', authGuard, overtimeCalloutController.getPendingOvertimeCallouts);
router.post('/', authGuard, overtimeCalloutController.createOvertimeCallout);

export default router;
