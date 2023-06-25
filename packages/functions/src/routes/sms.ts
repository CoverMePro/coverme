import express, { Router } from 'express';
import smsController from '../controllers/sms';

const router: Router = express.Router();

router.post('/reply-approve', smsController.handleSmsReplyApprove);
router.post('/reply-reject', smsController.handleSmsReplyReject);

export default router;