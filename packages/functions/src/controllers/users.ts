import { Request, Response } from 'express';
import { IUser } from '../coverme-shared';
import dbHandler from '../db/db-handler';
import { fbAdmin } from '../utils/admin';

/**
 * @api {get} /api/users/:id Get User
 * @apiName getUser
 * @apiGroup Users
 *
 * @apiDescription Get data from a specific user.
 *
 * @apiParam {Number} id The id of the user.
 *
 * @apiSuccess {Object} user The selected user data.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const getUser = (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const user = dbHandler.getDocumentById<IUser>('users', id);
		return res.json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {get} /api/users Get All Users
 * @apiName getAllUsers
 * @apiGroup Users
 *
 * @apiDescription Get all users of the application.
 *
 * @apiSuccess {Object[]} users An array of all users.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const getAllUsers = async (_: Request, res: Response) => {
	try {
		const users = await dbHandler.getCollectionWithCondition('users', 'role', '!=', 'owner');
		return res.json(users);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {get} /api/users/staff Get Staff
 * @apiName getStaff
 * @apiGroup Users
 *
 * @apiDescription Get all staff specific users.
 *
 * @apiSuccess {Object[]} staff An array of all staff users.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const getStaff = async (_: Request, res: Response) => {
	try {
		const staff = await dbHandler.getCollectionWithConditionAndSort(
			'users',
			'role',
			'==',
			'Staff',
			'hireDate',
			'asc'
		);
		return res.json(staff);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {post} /api/users Get Users From List
 * @apiName getUsersFromList
 * @apiGroup Users
 *
 * @apiDescription Get all users from a given list of Ids.
 *
 * @apiBody {String[]} userIds List of Ids to get users from.
 *
 * @apiSuccess {Object[]} users An array of users found.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const getUsersFromList = async (req: Request, res: Response) => {
	const userIds = req.body.userIds;

	try {
		let users: IUser[] = [];

		if (userIds.length > 0) {
			users = await dbHandler.getCollectionWithCondition<IUser>(
				'users',
				'__name__',
				'in',
				userIds
			);
		}

		return res.json({ users });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {post} /api/users/:id Update User
 * @apiName updateUser
 * @apiGroup Users
 *
 * @apiDescription Get all users from a given list of Ids
 *
 * @apiParam {Number} id The id of the user.
 *
 * @apiBody {Object} userInfo The user Data to update.
 *
 * @apiSuccess {Object} result The success result object.
 * @apiSuccess {String} result.message Success message.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const updateUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	let userInfo: IUser = req.body;

	try {
		const user = await dbHandler.getDocumentById<IUser>('users', id);
		let updateEmail = false;

		if (user) {
			updateEmail = user.email !== userInfo.email;
		}

		await dbHandler.updateDocument('users', id, { ...userInfo });

		if (updateEmail) {
			await fbAdmin.auth().updateUser(user.id, {
				email: userInfo.email,
			});
		}

		return res.json({ message: 'User updated successfully!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {get} /api/users/check/:id Check User
 * @apiName checkUser
 * @apiGroup Users
 *
 * @apiDescription Check if a user exists.
 *
 * @apiParam {Number} id The id of the user.
 *
 * @apiSuccess {Object} result The success result object.
 * @apiSuccess {bool} result.exists Result if the user exist or not.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const checkUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const exists = await dbHandler.documentExistsById('users', id);

		return res.json({ exists });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

export default {
	getUser,
	getAllUsers,
	getStaff,
	getUsersFromList,
	updateUser,
	checkUser,
};
