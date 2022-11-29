import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import messageController from '../controllers/message';

const router: Router = express.Router();

router.get('/', authGuard, messageController.getMessages);

router.post('/', authGuard, messageController.createMessage);

export default router;
