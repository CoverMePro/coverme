import { Request, Response } from 'express';
import { ITeam, IUser } from '../coverme-shared';
import dbHandler from '../db/db-handler';
import { getBatch } from '../db/batch-handler';

/**
 * @api {get} /api/teams Get All Teams
 * @apiName getAllTeams
 * @apiGroup Teams
 *
 * @apiDescription Get all the created teams
 *
 * @apiSuccess {Object[]} teams An array of all the teams
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const getAllTeams = async (_: Request, res: Response) => {
	try {
		const teams = await dbHandler.getCollection<ITeam>('teams');

		return res.json(teams);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {post} /api/teams Create Team
 * @apiName createTeam
 * @apiGroup Teams
 *
 * @apiDescription Get all the created teams
 *
 * @apiBody {Object} team The team Data to create.
 *
 * @apiSuccess {Object} teamAdded The created team returned.
 *
 * @apiError (Error 403 Already Exists) {Object} errorResult The error result object.
 * @apiError (Error 403 Already Exists) {String} errorResult.error Message explaining the team already exist
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const createTeam = async (req: Request, res: Response) => {
	try {
		const team: ITeam = req.body;
		const teamExist = await dbHandler.documentExistsById('teams', team.id);

		if (teamExist) {
			return res.status(403).json({ error: 'Team with that name already exists' });
		}

		await dbHandler.setDocument('teams', team.id, {
			managers: team.managers,
			staff: team.staff,
		});

		const teamAdded = await dbHandler.getDocumentById<ITeam>('teams', team.id);

		const batch = getBatch();

		const users = await dbHandler.getCollectionWithCondition<IUser>('users', '__name__', 'in', [
			...team.managers,
			...team.staff,
		]);

		users.forEach(async (user: IUser) => {
			let teams: string[] = [];

			const userDoc = dbHandler.getDocumentSnapshot(`users/${user.id}`);

			if (user.teams) {
				teams = [...user.teams, teamAdded.id];
			} else {
				teams = [teamAdded.id];
			}

			batch.update(userDoc, { teams: teams });
		});

		await batch.commit();

		return res.json(teamAdded);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {get} /api/teams/:name/delete Delete Team
 * @apiName deleteTeam
 * @apiGroup Teams
 *
 * @apiDescription Delete a selected team and unreference it to all users
 *
 * @apiParam {String} name The name of the team to delete
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const deleteTeam = async (req: Request, res: Response) => {
	const { name } = req.params;

	try {
		await dbHandler.deleteDocument('teams', name);

		const users = await dbHandler.getCollectionWithCondition<IUser>(
			'users',
			'teams',
			'array-contains',
			name
		);

		const batch = getBatch();

		users.forEach(async (user) => {
			const userDoc = dbHandler.getDocumentSnapshot(`users/${user.id}`);

			const teams = user.teams.filter((t: any) => t != name);

			batch.update(userDoc, { teams: teams });
		});

		await batch.commit();

		return res.json({ message: 'Team Deleted!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {post} /api/teams/:name/add-manager Add Manager To Team
 * @apiName addManagerToTeam
 * @apiGroup Teams
 *
 * @apiDescription Adds a selected manager user to the team
 *
 * @apiParam {String} name The name of the team
 *
 * @apiBody {Object} user The data of the manager user to add to team
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const addManagerToTeam = async (req: Request, res: Response) => {
	const { name } = req.params;
	const user = req.body;

	try {
		const team = await dbHandler.getDocumentById<ITeam>('teams', name);

		team.managers.push(user.id);

		await addTeamToUser(name, team, user);

		return res.json({ message: 'User added to team!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {post} /api/teams/:name/add-staff Add Staff To Team
 * @apiName addStaffToTeam
 * @apiGroup Teams
 *
 * @apiDescription Adds a selected staff user to the team
 *
 * @apiParam {String} name The name of the team
 *
 * @apiBody {Object} user The data of the staff user to add to team
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const addStaffToTeam = async (req: Request, res: Response) => {
	const { name } = req.params;
	const staff = req.body;

	try {
		const team = await dbHandler.getDocumentById<ITeam>('teams', name);

		team.staff.push(staff.id);

		await addTeamToUser(name, team, staff);

		return res.json({ message: 'Staff member added to team!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {post} /api/teams/:name/remove-manager Remove Manager From Team
 * @apiName removeManagerFromTeam
 * @apiGroup Teams
 *
 * @apiDescription Removes a selected manager user from the team
 *
 * @apiParam {String} name The name of the team
 *
 * @apiBody {Object} user The data of the manager user to remove from team
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const removeManagerFromTeam = async (req: Request, res: Response) => {
	const { name } = req.params;
	const user = req.body;

	try {
		const team = await dbHandler.getDocumentById<ITeam>('teams', name);

		let newTeams: string[] = [];

		newTeams = team.managers.filter((manager: string) => manager !== user.id);

		team.managers = newTeams;

		await removeTeamFromUser(name, team, user);

		return res.json({ message: 'Manager removed from team!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {post} /api/teams/:name/remove-staff Remove Staff From Team
 * @apiName removeStaffFromTeam
 * @apiGroup Teams
 *
 * @apiDescription Removes a selected staff user from the team
 *
 * @apiParam {String} name The name of the team
 *
 * @apiBody {Object} user The data of the staff user to remove from team
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const removeStaffFromTeam = async (req: Request, res: Response) => {
	const { name } = req.params;
	const staff = req.body;

	try {
		const team = await dbHandler.getDocumentById<ITeam>('teams', name);

		let newTeams: string[] = [];

		newTeams = team.staff.filter((s: string) => s !== staff.id);

		team.staff = newTeams;

		await removeTeamFromUser(name, team, staff);

		return res.json({ message: 'Staff removed from team!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

async function addTeamToUser(name: string, team: ITeam, user: any) {
	try {
		const teamData: any = {
			...team,
		};

		delete teamData.name;

		await dbHandler.setDocument('teams', name, teamData);

		const userData: any = await dbHandler.getDocumentById<IUser>('users', user.id);

		delete userData.id;

		if (userData.teams) {
			userData.teams.push(name);
		} else {
			userData.teams = [name];
		}

		await dbHandler.setDocument('users', user.id, userData);
	} catch (err) {
		throw err;
	}
}

async function removeTeamFromUser(name: string, team: ITeam, user: any) {
	try {
		const teamData: any = {
			...team,
		};

		delete teamData.name;

		await dbHandler.setDocument('teams', name, teamData);

		const userData: any = await dbHandler.getDocumentById<IUser>('users', user.id);

		delete userData.id;

		if (userData.teams) {
			const newTeams = userData.teams.filter((team: string) => team !== name);

			userData.teams = newTeams;
		}

		await dbHandler.setDocument('users', user.id, userData);
	} catch (err) {
		throw err;
	}
}

export default {
	createTeam,
	getAllTeams,
	deleteTeam,
	addManagerToTeam,
	addStaffToTeam,
	removeManagerFromTeam,
	removeStaffFromTeam,
};
