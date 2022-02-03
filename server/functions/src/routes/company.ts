import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import companyController from '../controller/company';
import teamController from '../controller/team';
import shiftController from '../controller/shift';

const router: Router = express.Router();

// GET
router.get('/', authGuard, companyController.getAllCompanies);
router.get('/info', authGuard, companyController.getAllCompaniesInfo);
router.get('/check/:id', authGuard, companyController.checkCompany);
router.get('/:id', authGuard, companyController.getCompany);
router.get('/delete/:id', authGuard, companyController.deleteCompany);
router.get('/:id/team', authGuard, teamController.getAllTeams);
router.get('/:companyId/team/:teamId/delete', teamController.deleteTeam);
router.get('/:name/shifts', authGuard, shiftController.getShiftsAndStaff);

// POST
router.post('/create', authGuard, companyController.createCompany);
router.post('/:id/create-team', authGuard, teamController.createTeam);
router.post('/:companyId/team/:teamId/add-user', authGuard, teamController.addUserToTeam);
router.post('/:companyId/team/:teamId/remove-user', authGuard, teamController.removeUserFromTeam);
router.post('/:name/shift-transactions', shiftController.transactionShifts);

export default router;
