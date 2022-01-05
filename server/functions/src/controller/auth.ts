import { Request, Response } from 'express';

import { IUserLogin, IUserInfo } from '../models/User';
import { SESSION_COOKIE_EXPIRY, WEB_CLIENT_DOMAIN } from '../constants';

import { db, fbAuth, fbAdmin } from '../utils/admin';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { assignSessionCookie, verifySessionCookie } from '../utils/authenticate-user';
import { emailSignInForUser, emailPasswordReset } from '../utils/fb-emails';

/**
 * Creates user in firebase authentication and adds the necessary user info into the database
 */
const registerUser = (req: Request, res: Response) => {
    const { email, password, phoneNo } = req.body;

    let token: string;
    createUserWithEmailAndPassword(fbAuth, email, password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((tokenId) => {
            token = tokenId;

            return db
                .doc(`/users/${email}`)
                .update({ phoneNo, status: 'Active', statusUpdatedAt: Date.now() });
        })
        .then(() => {
            return db.doc(`/users/${email}`).get();
        })
        .then((userData) => {
            const userInfo: IUserInfo = {
                data: { ...userData.data() },
                email: userData.id,
            };
            return res.json({
                message: 'User created successfully!',
                user: userInfo,
                token: token,
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ error });
        });
};

/**
 * Sends a sign in link email to a user who is being registered with the firebase sign in link template
 * At this time the user is not created in the firebase authentication
 * This is a hacky approach for now, will look into doing a more custom email approach
 */
const sendRegisterLink = (req: Request, res: Response) => {
    const { email, firstName, lastName, company, role, position } = req.body;

    emailSignInForUser(fbAuth, {
        email,
        firstName,
        lastName,
        company,
        role,
        position,
    })
        .then(() => {
            return db.doc(`/users/${email}`).set({
                firstName,
                lastName,
                company,
                role,
                position,
                status: 'Pending',
                statusUpdatedAt: Date.now(),
            });
        })
        .then(() => {
            return res.json({ message: 'Email link successful', email });
        })
        .catch((error) => {
            console.log(error);

            return res.status(500).json({ error });
        });
};

/**
 * Callback for when user clicks the sign in link in the email
 */
const registerCallback = (req: Request, res: Response) => {
    const { email } = req.query;
    return res.redirect(`${WEB_CLIENT_DOMAIN}/onboard?email=${email}`);
};

/**
 * Logs user into the application
 */
const signIn = (req: Request, res: Response) => {
    const userLogin: IUserLogin = req.body;

    let cookie: string;

    // Assign a expiry date for the cookie
    // currently it is <6 MINUTES>
    const expiresIn = SESSION_COOKIE_EXPIRY;

    return signInWithEmailAndPassword(fbAuth, userLogin.email, userLogin.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((tokenId) => {
            // create session cookie
            return assignSessionCookie(tokenId, expiresIn);
        })
        .then((sessionCookie) => {
            cookie = sessionCookie;

            // retreive user info to send to client
            return db.doc(`/users/${userLogin.email}`).get();
        })
        .then((userData) => {
            const userInfo: IUserInfo = {
                data: { ...userData.data() },
                email: userData.id,
            };

            const cookieOptions = { maxAge: expiresIn, httpOnly: true, secure: true };
            res.cookie('session', cookie, cookieOptions);
            return res.json({ message: 'login successful', user: userInfo });
        })
        .catch((err) => {
            switch (err.code) {
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    return res.status(403).json({ general: 'Wrong credentials, please try again' });
                default:
                    return res.status(500).json({ error: err });
            }
        });
};

const deleteAuthUser = (req: Request, res: Response) => {
    const email = req.params.email;

    db.doc(`/users/${email}`)
        .get()
        .then((userData) => {
            const user = userData.data();
            if (user && user.status === 'Active') {
                fbAdmin
                    .auth()
                    .getUserByEmail(email)
                    .then((userRecord) => {
                        return fbAdmin.auth().deleteUser(userRecord.uid);
                    })
                    .then(() => {
                        return db.doc(`/users/${email}`).delete();
                    })
                    .then(() => {
                        return res.json({ message: 'user successfully deleted' });
                    })
                    .catch((err) => {
                        return res.status(500).json({ error: err });
                    });
            } else {
                db.doc(`/users/${email}`)
                    .delete()
                    .then(() => {
                        return res.json({ message: 'user successfully deleted' });
                    })
                    .catch((err) => {
                        return res.status(500).json({ error: err });
                    });
            }
        })
        .catch((err) => {
            return res.status(500).json({ error: err });
        });
};

const logOut = (req: Request, res: Response) => {
    signOut(fbAuth)
        .then(() => {
            res.clearCookie('session');
            return res.json({ message: 'logged out successfully' });
        })
        .catch((err) => {
            return res.status(500).json({ error: err });
        });
};

/*
 * Check if you have a session cookie so you can bypass login
 */
const checkAuth = async (req: Request, res: Response) => {
    if (req.cookies.session) {
        try {
            const sessionCookie = `${req.cookies.session}`;

            const decodedToken = await verifySessionCookie(sessionCookie);

            if (decodedToken.email) {
                const userData = await db.doc(`/users/${decodedToken.email}`).get();

                const userInfo: IUserInfo = {
                    data: { ...userData.data() },
                    email: userData.id,
                };

                return res.json({ authenticated: true, user: userInfo });
            } else {
                return res.status(401).json({ error: 'No email found' });
            }
        } catch (error) {
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

    emailPasswordReset(fbAuth, email)
        .then(() => {
            return res.json({ message: 'Reset email sent!' });
        })
        .catch((err) => {
            return res.status(500).json({ error: err });
        });
};

export default {
    checkAuth,
    sendRegisterLink,
    registerUser,
    signIn,
    deleteAuthUser,
    logOut,
    registerCallback,
    passwordReset,
};
