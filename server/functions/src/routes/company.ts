import express, { Router } from 'express';

import companyController from '../controller/company';

const router: Router = express.Router();

router.post('/create', companyController.createCompany);
router.get('/get-all', companyController.getAllCompanies);

export default router;
