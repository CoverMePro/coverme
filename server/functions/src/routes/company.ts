import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import companyController from '../controller/company';

const router: Router = express.Router();

router.get('/', authGuard, companyController.getAllCompanies);
router.post('/create', companyController.createCompany);
router.get('/check/:id', companyController.checkCompany);
router.get('/:id', companyController.getCompany);

export default router;
