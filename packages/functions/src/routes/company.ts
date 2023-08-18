import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import companyController from '../controllers/company';

const router: Router = express.Router();

router.post('/', authGuard, companyController.updateCompany);

export default router;
