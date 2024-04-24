import { Request, Response } from 'express';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

import { ITeam, IUser, IUserLogin } from '../coverme-shared';

import { SESSION_COOKIE_EXPIRY } from '../constants';

import { fbAuth, fbAdmin } from '../utils/admin';
import { assignSessionCookie, verifySessionCookie } from '../utils/authenticate-user';
import { emailSignInForUser, emailPasswordReset } from '../utils/fb-emails';
import dbHandler from '../db/db-handler';
import { updateNewUserIntoDb } from '../db/db-helpers';
import { batchSetAndDelete } from '../db/batch-handler';

const registerUser = async (req: Request, res: Response) => {
	const { email, password, phone } = req.body;
	try {
		const data = await createUserWithEmailAndPassword(fbAuth, email, password);

		const userUID = data.user.uid;

		const user: IUser = await dbHandler.getDocumentFromCollectionWithCondition<IUser>(
			'users',
			'email',
			'==',
			email
		);

		const userData: any = {
			...user,
			phone,
			status: 'Active',
		};

		delete userData.id;

		await batchSetAndDelete(
			{
				path: 'users',
				id: userUID,
				data: userData,
			},
			{
				path: 'users',
				id: user.id,
			}
		);

		return res.json({
			message: 'User created successfully!',
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error });
	}
};

const completeRegisterUser = async (req: Request, res: Response) => {
	const { email, password, firstName, lastName, role, phone } = req.body;

	try {
		const authData = await createUserWithEmailAndPassword(fbAuth, email, password);

		await dbHandler.setDocument('users', authData.user.uid, {
			email,
			firstName,
			lastName,
			role,
			phone,
			status: 'Active',
		});

		return res.json({
			message: 'User created successfully!',
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error });
	}
};

/**
 * Sends a sign in link email to a user who is being registered with the firebase sign in link template
 * At this time the user is not created in the firebase authentication
 * This is a hacky approach for now, will look into doing a more custom email approach
 */
const sendRegisterLink = async (req: Request, res: Response) => {
	const userInfo: IUser = req.body;

	try {
		await emailSignInForUser(fbAuth, userInfo.email);
		await updateNewUserIntoDb(userInfo);

		return res.json({ message: 'Email link successful', email: userInfo.email });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error });
	}
};

const registerCallback = (req: Request, res: Response) => {
	const { email } = req.query;
	return res.redirect(`${process.env.WEB_CLIENT_DOMAIN}/register?email=${email}`);
};

const signIn = async (req: Request, res: Response) => {
	const userLogin: IUserLogin = req.body;

	const expiresIn = SESSION_COOKIE_EXPIRY;

	try {
		const authData = await signInWithEmailAndPassword(
			fbAuth,
			userLogin.email,
			userLogin.password
		);
		const tokenId = await authData.user.getIdToken();
		const sessionCookie = await assignSessionCookie(tokenId, expiresIn);

		const [user, company] = await dbHandler.getMultipleCollections([
			dbHandler.getDocumentById('users', authData.user.uid),
			dbHandler.getDocumentById('company', 'info'),
		]);

		const teams = await dbHandler.getCollectionWithCondition<ITeam>(
			'teams',
			'staff',
			'array-contains',
			authData.user.uid
		);

		let managerIds: string[] = [];

		teams.forEach((team) => {
			managerIds = [...managerIds, ...team.managers];
		});

		user.reportTo = [...managerIds];

		const cookieOptions = {
			maxAge: expiresIn,
			httpOnly: true,
			secure: true,
			sameSite: 'none' as 'none',
		};

		res.cookie('__session', sessionCookie, cookieOptions);
		return res.json({
			message: 'login successful',
			userInfo: user,
			companyInfo: company,
		});
	} catch (error) {
		console.error(error);
		if ((error as any).code) {
			switch ((error as any).code) {
				case 'auth/wrong-password':
				case 'auth/user-not-found':
					return res.status(403).json({ general: 'Wrong credentials, please try again' });
				default: {
					return res.status(500).json({ error: error });
				}
			}
		}

		return res.status(500).json({ error: error });
	}
};

const deleteAuthUser = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const user: IUser = await dbHandler.getDocumentById('users', id);

		if (user && user.status === 'Active') {
			await fbAdmin.auth().deleteUser(id);

			await dbHandler.deleteDocument('users', id);

			return res.json({ message: 'user successfully deleted' });
		} else {
			await dbHandler.deleteDocument('users', id);

			return res.json({ message: 'user successfully deleted' });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const logOut = (_: Request, res: Response) => {
	signOut(fbAuth)
		.then(() => {
			const expiresIn = SESSION_COOKIE_EXPIRY;

			const cookieOptions = {
				maxAge: expiresIn,
				httpOnly: true,
				secure: true,
				sameSite: 'none' as 'none',
			};
			res.clearCookie('__session', cookieOptions);
			return res.json({ message: 'logged out successfully' });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err });
		});
};

/*
 * Check if you have a session cookie so you can bypass login
 */
const checkAuth = async (req: Request, res: Response) => {
	if (req.cookies['__session']) {
		try {
			const sessionCookie = `${req.cookies['__session']}`;

			const decodedToken = await verifySessionCookie(sessionCookie);

			if (decodedToken.email) {
				const [user, company] = await dbHandler.getMultipleCollections([
					dbHandler.getDocumentById('users', decodedToken.uid),
					dbHandler.getDocumentById('company', 'info'),
				]);

				return res.json({ userInfo: user, companyInfo: company });
			} else {
				return res.status(401).json({ error: 'No email found' });
			}
		} catch (err) {
			return res.status(401).json({ error: 'Session Expired' });
		}
	} else {
		return res.status(401).json({ error: 'Session Empty' });
	}
};

const passwordReset = (req: Request, res: Response) => {
	const { email } = req.body;

	emailPasswordReset(fbAuth, email)
		.then(() => {
			return res.json({ message: 'Reset email sent!' });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err });
		});
};

const updateMessageToken = async (req: Request, res: Response) => {
	const { userId, token } = req.body;

	try {
		await dbHandler.setDocument('message-tokens', userId, { token: token });
		return res.json({ message: 'Token Set' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

export default {
	checkAuth,
	completeRegisterUser,
	sendRegisterLink,
	registerUser,
	signIn,
	deleteAuthUser,
	logOut,
	registerCallback,
	passwordReset,
	updateMessageToken,
};
