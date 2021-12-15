import { Request, Response } from 'express';

import { IUserLogin, IUserInfo } from '../models/User';

import { db, firebaseAuth } from '../utils/admin';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { assignSessionCookie, verifySessionCookie } from '../utils/authenticate-user';
import { emailSignInForUser, emailPasswordReset } from '../utils/fb-emails';

/**
 * Creates user in firebase authentication and adds the necessary user info into the database
 */
const registerUser = (req: Request, res: Response) => {
	const { email, password, phoneNo } = req.body;

	let token: string;
	createUserWithEmailAndPassword(firebaseAuth, email, password)
		.then(data => {
			return data.user.getIdToken();
		})
		.then(tokenId => {
			token = tokenId;

			return db.doc(`/users/${email}`).update({ phoneNo });
		})
		.then(() => {
			return db.doc(`/users/${email}`).get();
		})
		.then(userData => {
			const userInfo: IUserInfo = {
				data: { ...userData.data() },
				email: userData.id
			};
			return res.json({
				message: 'User created successfully!',
				user: userInfo,
				token: token
			});
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

/**
 * Sends a sign in link email to a user who is being registered with the firebase sign in link template
 * At this time the user is not created in the firebase authentication
 * This is a hacky approach for now, will look into doing a more custom email approach
 */
const sendRegisterLink = (req: Request, res: Response) => {
	const { email, firstName, lastName, company, role, position } = req.body;

	emailSignInForUser(firebaseAuth, { email, firstName, lastName, company, role, position })
		.then(() => {
			return res.json({ message: 'Email link successful', email });
		})
		.catch(error => {
			console.log(error);

			return res.status(500).json({ error });
		});
};

/**
 * Callback for when user clicks the sign in link in the email
 */
const registerCallback = (req: Request, res: Response) => {
	const { email, firstName, lastName, company, role, position } = req.query;

	db.doc(`/users/${email}`)
		.set({
			firstName,
			lastName,
			company,
			role,
			position
		})
		.then(result => {
			// To Do: make sure this url is configurable
			return res.redirect(`http://localhost:3000/onboard?email=${email}`);
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

/**
 * Logs user into the application
 */
const signIn = (req: Request, res: Response) => {
	const userLogin: IUserLogin = req.body;

	let cookie: string;

	// Assign a expiry date for the cookie
	// currently it is <6 MINUTES>
	const expiresIn = 60 * 6 * 1000; //60 * 60 * 24 * 1 * 1000;

	return signInWithEmailAndPassword(firebaseAuth, userLogin.email, userLogin.password)
		.then(data => {
			return data.user.getIdToken();
		})
		.then(tokenId => {
			// create session cookie
			return assignSessionCookie(tokenId, expiresIn);
		})
		.then(sessionCookie => {
			cookie = sessionCookie;

			// retreive user info to send to client
			return db.doc(`/users/${userLogin.email}`).get();
		})
		.then(userData => {
			const userInfo: IUserInfo = {
				data: { ...userData.data() },
				email: userData.id
			};

			const cookieOptions = { maxAge: expiresIn, httpOnly: true, secure: true };
			res.cookie('session', cookie, cookieOptions);
			return res.json({ message: 'login successful', user: userInfo });
		})
		.catch(err => {
			console.error(err);
			return res.status(403).json({ general: 'Wrong credentials, please try again' });
		});
};

/*
 * Check if you have a session cookie so you can bypass login
 */
const checkAuth = async (req: Request, res: Response) => {
	if (req.cookies.session) {
		const sessionCookie = `${req.cookies.session}`;

		const result = await verifySessionCookie(sessionCookie);

		if (result) {
			return res.json({ authenticated: true });
		} else {
			return res.status(401).json({ error: 'Session Expired' });
		}
	} else {
		return res.status(401).json({ error: 'Session Empty' });
	}
};

/**
 * Reset a users password
 */
const passwordReset = (req: Request, res: Response) => {
	const { email } = req.body;

	emailPasswordReset(firebaseAuth, email)
		.then(() => {
			return res.json({ message: 'Reset email sent!' });
		})
		.catch(err => {
			return res.status(500).json({ error: err });
		});
};

export default {
	checkAuth,
	sendRegisterLink,
	registerUser,
	signIn,
	registerCallback,
	passwordReset
};
