import { Request, Response } from 'express';
import { IUser } from 'coverme-shared';
import dbHandler from '../db/db-handler';
import { fbAdmin } from '../utils/admin';

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

const getAllUsers = async (_: Request, res: Response) => {
	try {
		const users = await dbHandler.getCollectionWithCondition('users', 'role', '!=', 'owner');
		return res.json(users);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

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
	getUsersFromList,
	updateUser,
	checkUser,
};
