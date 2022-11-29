import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';

import teamController from '../controllers/teams';

const router: Router = express.Router({ mergeParams: true });

router.get('/', authGuard, teamController.getAllTeams);
router.get('/:name/delete', teamController.deleteTeam);

router.post('/', authGuard, teamController.createTeam);
router.post('/:name/add-user', authGuard, teamController.addUserToTeam);
router.post('/:name/remove-user', authGuard, teamController.removeUserFromTeam);

export default router;
