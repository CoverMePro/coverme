import express, { Router } from 'express';
import authController from '../controller/auth';

const router: Router = express.Router();

router.get('/', authController.checkAuth);
router.post('/register-link', authController.sendRegisterLink);
router.post('/register', authController.registerUser);
router.get('/register-callback', authController.registerCallback);
router.post('/signin', authController.signIn);
router.post('/reset-password', authController.passwordReset);

export default router;
