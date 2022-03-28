import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';
import companyController from '../controllers/company';
import teamController from '../controllers/team';
import shiftController from '../controllers/shift';
import tradeController from '../controllers/trade';
import sickController from '../controllers/sick';

const router: Router = express.Router();

// COMPANY
router.get('/', authGuard, companyController.getAllCompanies);
router.get('/info', authGuard, companyController.getAllCompaniesInfo);
router.get('/check/:id', authGuard, companyController.checkCompany);
router.get('/:id', authGuard, companyController.getCompany);
router.get('/delete/:id', authGuard, companyController.deleteCompany);

router.post('/create', authGuard, companyController.createCompany);

//TEAM
router.get('/:id/team', authGuard, teamController.getAllTeams);
router.get('/:companyId/team/:teamId/delete', teamController.deleteTeam);

router.post('/:id/create-team', authGuard, teamController.createTeam);
router.post('/:companyId/team/:teamId/add-user', authGuard, teamController.addUserToTeam);
router.post('/:companyId/team/:teamId/remove-user', authGuard, teamController.removeUserFromTeam);

//SHIFT
router.get('/:name/shifts', authGuard, shiftController.getShiftsAndStaff);
router.get('/:name/shifts/:user', authGuard, shiftController.getShiftForUser);
router.get('/:name/shift-definition', authGuard, shiftController.getShiftDefinitions);
router.post('/:name/shift-definition', authGuard, shiftController.createShiftDefinition);
router.get('/:name/shift-definition/:id/delete', authGuard, shiftController.deleteShiftDefinition);

router.post('/:name/shift-transactions', authGuard, shiftController.transactionShifts);

// TRADE REQUEST
router.post('/:name/trade-request', authGuard, tradeController.createTradeRequest);
router.get('/:name/trade-request/:user', authGuard, tradeController.getUserTradeRequest);
router.get('/:name/trade-request/:id/delete', authGuard, tradeController.deleteTradeRequest);
router.get('/:name/trade-request/:id/accept', authGuard, tradeController.acceptTradeRequest);
router.get('/:name/trade-request/:id/reject', authGuard, tradeController.rejectTradeRequest);
router.post('/:name/trade-request/:id/archive', authGuard, tradeController.archiveTradeRequest);

// SICK REQUEST
router.post('/:name/sick-request', authGuard, sickController.createSickRequest);
router.get('/:name/sick-request/:user', authGuard, sickController.getSickRequests);
router.get('/:name/sick-request/:id/approve', authGuard, sickController.approveSickRequest);
router.get('/:name/sick-request/:id/reject', authGuard, sickController.rejectSickRequest);
router.get('/:name/sick-request/:id/delete', authGuard, sickController.deleteSickRequest);

export default router;
