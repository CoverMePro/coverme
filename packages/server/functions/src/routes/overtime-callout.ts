import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import overtimeCalloutController from '../controllers/overtime-callout';

const router: Router = express.Router();

router.get('/', authGuard, overtimeCalloutController.getOvertimeCallouts);

router.get('/test', authGuard, overtimeCalloutController.testCycleCallout);

router.get('/list', authGuard, overtimeCalloutController.getCompanyOvertimeCalloutList);

router.get('/:id/:user/info', overtimeCalloutController.getOvertimeCalloutInfo);

router.post('/:id/accept', overtimeCalloutController.acceptCalloutShift);

router.post('/:id/reject', overtimeCalloutController.rejectedCalloutShift);

router.post('/', authGuard, overtimeCalloutController.createOvertimeCallout);

export default router;
