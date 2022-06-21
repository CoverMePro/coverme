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
router.get('/', authGuard, companyController.getAllCompanyNames);
router.get('/info', authGuard, companyController.getAllCompanies);
router.get('/check/:name', authGuard, companyController.checkIfCompanyExist);
router.get('/:name', authGuard, companyController.getCompany);
router.get('/delete/:name', authGuard, companyController.deleteCompany);

router.get('/:name/overtime-list', authGuard, companyController.getCompanyOvertimeCalloutList);

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
