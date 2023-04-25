import express, { Router } from 'express';
import authGuard from '../../utils/authenticate-user';
import shiftController from '../../controllers/shifts';

const router: Router = express.Router({ mergeParams: true });

router.get('/', authGuard, shiftController.getShiftTemplates);
router.get('/:id/delete', authGuard, shiftController.deleteShiftTemplate);

router.post('/', authGuard, shiftController.createShiftTemplate);
router.post('/:id', authGuard, shiftController.updateShiftTemplate);

export default router;
