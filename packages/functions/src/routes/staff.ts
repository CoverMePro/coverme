import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import staffController from '../controllers/staff';

const router: Router = express.Router();

router.get('/', authGuard, staffController.getAllStaff);
router.get('/check/:id', authGuard, staffController.checkStaff);
router.get('/:id', authGuard, staffController.getStaff);

router.post('/', authGuard, staffController.createStaff);
router.post('/:id', authGuard, staffController.updateStaff);

export default router;
