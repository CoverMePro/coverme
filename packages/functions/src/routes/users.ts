import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import userController from '../controllers/users';

const router: Router = express.Router();

router.get('/', authGuard, userController.getAllUsers);
router.get('/staff', authGuard, userController.getStaff);
router.get('/check/:id', authGuard, userController.checkUser);
router.get('/:id', authGuard, userController.getUser);

router.post('/:id', authGuard, userController.updateUser);
router.post('/', authGuard, userController.getUsersFromList);

export default router;
