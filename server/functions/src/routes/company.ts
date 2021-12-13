import express, { Router } from 'express';

import companyController from '../controller/company';

const router: Router = express.Router();

router.post('/create', companyController.createCompany);
router.get('/check/:id', companyController.checkCompany);
router.get('/:id', companyController.getCompany);
router.get('/get-all', companyController.getAllCompanies);

export default router;
