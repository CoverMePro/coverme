import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import overtimeCalloutController from '../controllers/overtime-callout';

const router: Router = express.Router();

router.get('/', authGuard, overtimeCalloutController.getOvertimeCallouts);

router.get('/test', authGuard, overtimeCalloutController.testCycleCallout);

router.get('/list', authGuard, overtimeCalloutController.getCompanyOvertimeCalloutList);

router.get('/:id/:user/info', overtimeCalloutController.getOvertimeCalloutInfo);

router.post('/accept', overtimeCalloutController.acceptCalloutShift);

router.post('/reject', overtimeCalloutController.rejectedCalloutShift);

router.post('/voice-response', overtimeCalloutController.voiceProcess);

router.post('/', authGuard, overtimeCalloutController.createOvertimeCallout);

export default router;
