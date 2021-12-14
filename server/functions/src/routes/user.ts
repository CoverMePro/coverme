import express, { Router } from 'express';
import userController from '../controller/user';

const router: Router = express.Router();

router.get('/check/:id', userController.checkUser);
router.get('/:id', userController.getUser);
router.post('/:id', userController.updateUser);

export default router;
