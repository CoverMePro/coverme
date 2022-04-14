import express, { Router } from 'express';
import authGuard from '../../../utils/authenticate-user';

import teamController from '../../../controllers/team';

const router: Router = express.Router();

router.get('/', authGuard, teamController.getAllTeams);
router.get('/:teamId/delete', teamController.deleteTeam);

router.post('/create-team', authGuard, teamController.createTeam);
router.post('/:teamId/add-user', authGuard, teamController.addUserToTeam);
router.post('/:teamId/remove-user', authGuard, teamController.removeUserFromTeam);

export default router;
