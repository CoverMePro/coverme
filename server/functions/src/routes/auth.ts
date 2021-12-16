import express, { Router } from 'express';
import authController from '../controller/auth';

const router: Router = express.Router();

// GET
router.get('/', authController.checkAuth);
router.get('/register-callback', authController.registerCallback);

// POST
router.post('/register-link', authController.sendRegisterLink);
router.post('/register', authController.registerUser);
router.post('/signin', authController.signIn);
router.post('/reset-password', authController.passwordReset);

export default router;
