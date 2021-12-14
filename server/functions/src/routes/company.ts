import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';

import companyController from '../controller/company';

const router: Router = express.Router();

router.post('/create', companyController.createCompany);
router.get('/check/:id', companyController.checkCompany);
router.get('/:id', companyController.getCompany);
router.get('/get-all', authGuard, companyController.getAllCompanies);

export default router;
