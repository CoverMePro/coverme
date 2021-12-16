import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import companyController from '../controller/company';

const router: Router = express.Router();

// GET
router.get('/', authGuard, companyController.getAllCompanies);
router.get('/check/:id', companyController.checkCompany);
router.get('/:id', companyController.getCompany);

// POST
router.post('/create', companyController.createCompany);

export default router;
