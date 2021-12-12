import express, { Router } from 'express';
import authController from '../controller/auth';

const router: Router = express.Router();

router.post('/register-link', authController.sendRegisterLink);
router.post('/register', authController.registerUser);
router.get('/register-callback', authController.registerCallback);
router.post('/signin', authController.signIn);
router.get('/user/:id', authController.getUser);
router.post('/user/:id', authController.updateUser);

export default router;
