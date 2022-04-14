import express, { Router } from 'express';
import authGuard from '../../../utils/authenticate-user';
import shiftController from '../../../controllers/shift';

const router: Router = express.Router();

router.get('/', authGuard, shiftController.getShiftDefinitions);
router.get('/:id/delete', authGuard, shiftController.deleteShiftDefinition);

router.post('/', authGuard, shiftController.createShiftDefinition);

export default router;
