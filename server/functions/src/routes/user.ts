import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import userController from '../controller/user';

const router: Router = express.Router();

// GET
router.get('/check/:id', authGuard, userController.checkUser);
router.get('/:id', authGuard, userController.getUser);
router.get('/all/:company', userController.getUsersFromCompany);

// POST
router.post('/:id', authGuard, userController.updateUser);
router.post('/', authGuard, userController.getUsersFromList);

export default router;
