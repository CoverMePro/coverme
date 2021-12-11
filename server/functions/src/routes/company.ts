import express, { Router } from 'express';

import companyController from '../controller/company';

const router: Router = express.Router();

router.post('/company', companyController.createCompany);

export default router;
