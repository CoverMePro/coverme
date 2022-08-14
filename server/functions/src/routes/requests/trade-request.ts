import express, { Router } from 'express';
import authGuard from '../../utils/authenticate-user';
import tradeController from '../../controllers/trade';

const router: Router = express.Router({ mergeParams: true });

router.post('/', authGuard, tradeController.createTradeRequest);

router.get('/:user', authGuard, tradeController.getUserTradeRequest);
router.get('/:id/delete', authGuard, tradeController.deleteTradeRequest);
router.get('/:id/accept', authGuard, tradeController.acceptTradeRequest);
router.get('/:id/reject', authGuard, tradeController.rejectTradeRequest);
router.post('/:id/archive', authGuard, tradeController.archiveTradeRequest);

export default router;
