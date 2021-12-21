import { Request, Response } from 'express';
import { IUser, IUserInfo } from '../models/User';

import { db } from '../utils/admin';

/**
 * Get a user based on their ID
 */
const getUser = (req: Request, res: Response) => {
	db.doc(`/users/${req.params.email}`)
		.get()
		.then(userData => {
			if (userData.exists) {
				const userInfo: IUserInfo = {
					data: { ...userData.data() },
					email: userData.id
				};
				return res.json(userInfo);
			} else {
				return res.status(404).json({ error: 'User not found' });
			}
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

/**
 * Get all users from a specific company (excluding owner)
 */
const getUsersFromCompany = (req: Request, res: Response) => {
	const company = req.params.company;

	db.collection('users')
		.where('company', '==', company)
		.where('role', '!=', 'owner')
		.get()
		.then(data => {
			const users: IUser[] = [];

			data.forEach(doc => {
				users.push({
					email: doc.id,
					...doc.data()
				});
			});

			return res.json({ users });
		})
		.catch(err => {
			console.log(err);
			return res.status(500).json({ error: err.code });
		});
};

/**
 * Update user info based on their ID
 */
const updateUser = (req: Request, res: Response) => {
	let userInfo: IUserInfo = req.body;

	db.doc(`/users/${req.params.userId}`)
		.update(userInfo.data!)
		.then(() => {
			return res.json({ message: 'User updated successfully!' });
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

/**
 * Check if user exist in the database
 */
const checkUser = (req: Request, res: Response) => {
	db.doc(`/users/${req.params.email}`)
		.get()
		.then(userData => {
			if (userData.exists) {
				return res.json({ exists: true });
			} else {
				return res.json({ exists: true });
			}
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

export default {
	getUser,
	getUsersFromCompany,
	updateUser,
	checkUser
};
