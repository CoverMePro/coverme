import express, { Router } from 'express';
import authGuard from '../utils/authenticate-user';

import teamController from '../controllers/teams';

const router: Router = express.Router({ mergeParams: true });

router.get('/', authGuard, teamController.getAllTeams);
router.get('/:name/delete', teamController.deleteTeam);

router.post('/', authGuard, teamController.createTeam);
router.post('/:name/add-manager', authGuard, teamController.addManagerToTeam);
router.post('/:name/add-staff', authGuard, teamController.addStaffToTeam);
router.post('/:name/remove-manager', authGuard, teamController.removeManagerFromTeam);
router.post('/:name/remove-staff', authGuard, teamController.removeStaffFromTeam);

export default router;
