import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import companyController from '../controller/company';

const router: Router = express.Router();

// GET
router.get('/', authGuard, companyController.getAllCompanies);
router.get('/check/:id', authGuard, companyController.checkCompany);
router.get('/:id', authGuard, companyController.getCompany);
router.get('/:id/team', authGuard, companyController.getAllTeams);

// POST
router.post('/create', authGuard, companyController.createCompany);
router.post('/:id/create-team', authGuard, companyController.createTeam);

export default router;
