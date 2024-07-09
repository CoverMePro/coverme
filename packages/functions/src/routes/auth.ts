import express, { Router } from 'express';
import authController from '../controllers/auth';

const router: Router = express.Router();

router.get('/', authController.checkAuth);
router.get('/logout', authController.logOut);
router.get('/delete/:id', authController.deleteAuthUser);

router.post('/complete-register', authController.completeRegisterUser);
router.post('/signin', authController.signIn);
router.post('/reset-password', authController.passwordReset);
router.post('/set-password', authController.setNewPassword);

export default router;
