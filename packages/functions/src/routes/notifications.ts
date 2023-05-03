import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import notificationsController from '../controllers/notifications';

const router: Router = express.Router();

router.get('/:userId', authGuard, notificationsController.getNotifications);

router.post('/acknowledge-one', authGuard, notificationsController.acknowledgeNotification);

router.post('/acknowledge-many', authGuard, notificationsController.acknowledgeNotifications);

router.post('/seen', authGuard, notificationsController.seenNotifications);

export default router;
