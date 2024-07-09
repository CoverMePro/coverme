import { Request, Response } from 'express';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	updatePassword,
	signOut,
} from 'firebase/auth';

import { IRegisterUser, ITeam, IUser, IUserLogin } from '../coverme-shared';

import { SESSION_COOKIE_EXPIRY } from '../constants';

import { fbAuth, fbAdmin } from '../utils/admin';
import { assignSessionCookie, verifySessionCookie } from '../utils/authenticate-user';
import { emailPasswordReset } from '../utils/fb-emails';
import dbHandler from '../db/db-handler';

/**
 * @api {post} /api/auth/complete-register Complete Register User
 * @apiName completeRegisterUser
 * @apiGroup Authentication
 *
 * @apiDescription Complete the registration process of the user. Creates the user in the Firebase Authentication and then stores data to Firestore.
 *
 * @apiBody {String} email Registered email that will be stored in Firebase Authentication.
 * @apiBody {String} password Temporary password for user to log in for the first time.
 * @apiBody {String} firstName First name of user.
 * @apiBody {String} lastName Last name of user.
 * @apiBody {String} role The role of the user in the application, can either be Admin, Manager, or Staff.
 * @apiBody {String} phone Phone number used to contact the user.
 * @apiBody {String} contactBy Whether they want to be contacted by text or phone call.
 * @apiBody {String} employeeType What type of employee are they, this can be Full-Time, Part-Time, or Temp.
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const completeRegisterUser = async (req: Request, res: Response) => {
	const registerUser: IRegisterUser = req.body;

	try {
		const authData = await createUserWithEmailAndPassword(
			fbAuth,
			registerUser.email,
			registerUser.password
		);

		await dbHandler.setDocument('users', authData.user.uid, {
			...registerUser,
			status: 'Pending',
		});

		return res.json({
			message: 'User registered successfully!',
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error });
	}
};

/**
 * @api {post} /api/auth/set-password Set New Password
 * @apiName setNewPassword
 * @apiGroup Authentication
 *
 * @apiDescription Setting a new password for user after they log in for the first time.
 *
 * @apiBody {String} password New password for the user to set
 * @apiBody {String} userId The Id of the user who is setting the password
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const setNewPassword = async (req: Request, res: Response) => {
	const { password, userId } = req.body;
	try {
		const user = fbAuth.currentUser;

		if (user != null) {
			await updatePassword(user, password);

			await dbHandler.updateDocument('users', userId, {
				status: 'Active',
			});

			return res.json({
				message: 'User password update successfully!',
			});
		} else {
			throw new Error('can not find logged in user');
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error });
	}
};

/**
 * @api {post} /api/auth/signin Sign In
 * @apiName signIn
 * @apiGroup Authentication
 *
 * @apiDescription Signin process of a user.
 *
 * @apiBody {String} email The user's login email
 * @apiBody {String} password The user's login password
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 * @apiSuccess {Object} result.userInfo The data of the user who just logged in
 * @apiSuccess {Object} result.companyInfo The data of the company
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
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

/**
 * @api {get} /api/auth/delete/:id Delete User
 * @apiName deleteUser
 * @apiGroup Authentication
 *
 * @apiDescription Delete a selected user from Firestore and Authentication.
 *
 * @apiParam {Number} id The id of the user to delete
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const deleteUser = async (req: Request, res: Response) => {
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

/**
 * @api {get} /api/auth/logout Logout
 * @apiName logout
 * @apiGroup Authentication
 *
 * @apiDescription Logs user out of the application, expires the token.
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
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

/**
 * @api {get} /api/auth Check Authentication
 * @apiName checkAuth
 * @apiGroup Authentication
 *
 * @apiDescription Verify authentication by checking the session cookie
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {Object} result.userInfo The data of the user who just logged in
 * @apiSuccess {Object} result.companyInfo The data of the company
 *
 * @apiError (Error 401) {Object} errorResult The error result object
 * @apiError (Error 401) {String} errorResult.error Message explaining the error. Either Session Expire/Empty or can not find email
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

/**
 * @api {post} /api/reset-password Reset Password
 * @apiName resetPassword
 * @apiGroup Authentication
 *
 * @apiDescription Sending the password reset logic to the user's email.
 *
 * @apiBody {String} email The user's email to reset password
 *
 * @apiSuccess {Object} result The success result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError (Error 500) {Object} errorResult The error result object
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const resetPassword = (req: Request, res: Response) => {
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

export default {
	checkAuth,
	completeRegisterUser,
	signIn,
	deleteUser,
	logOut,
	resetPassword,
	setNewPassword,
};
