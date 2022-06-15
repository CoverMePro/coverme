import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import overtimeCalloutController from '../controllers/overtime-callout';
import { callout } from '../utils/overtime';

const router: Router = express.Router();

router.get('/test', authGuard, callout)

router.get('/:company', authGuard, overtimeCalloutController.getPendingOvertimeCallouts);

router.post('/', authGuard, overtimeCalloutController.createOvertimeCallout);

export default router;
