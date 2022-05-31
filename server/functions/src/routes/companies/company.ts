import express, { Router } from 'express';
import authGuard from '../../utils/authenticate-user';
import companyController from '../../controllers/company';

import teamRoutes from './teams/team';
import shiftsRoutes from './shifts/shifts';
import shiftDefinitionRoutes from './shifts/shift-definition';
import shiftTransactionRoutes from './shifts/shift-transaction';
import tradeRequestRoutes from './requests/trade-request';
import sickRequestRoutes from './requests/sick-requests';
import timeOffRequestRoutes from './requests/time-off-requests';

const router: Router = express.Router();

// COMPANY
router.get('/', authGuard, companyController.getAllCompanies);
router.get('/info', authGuard, companyController.getAllCompaniesInfo);
router.get('/check/:id', authGuard, companyController.checkCompany);
router.get('/:id', authGuard, companyController.getCompany);
router.get('/delete/:id', authGuard, companyController.deleteCompany);

router.get('/:id/overtime-list', authGuard, companyController.getCompanyOvertimeCalloutList);

router.post('/create', authGuard, companyController.createCompany);

// TEAM
router.use('/:name/team', teamRoutes);

//SHIFT
router.use('/:name/shifts', shiftsRoutes);
router.use('/:name/shift-definition', shiftDefinitionRoutes);
router.use('/:name/shift-transactions', shiftTransactionRoutes);

// TRADE REQUEST
router.use('/:name/trade-request', tradeRequestRoutes);

// SICK REQUEST
router.use('/:name/sick-request', sickRequestRoutes);

// TIME OFF
router.use('/:name/time-off', timeOffRequestRoutes);

export default router;
