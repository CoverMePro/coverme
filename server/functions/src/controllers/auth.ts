import { Request, Response } from 'express';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

import { IUser, IUserLogin, mapToUser } from '../models/User';

import { SESSION_COOKIE_EXPIRY } from '../constants';

import { db, fbAuth, fbAdmin } from '../utils/admin';
import { assignSessionCookie, verifySessionCookie } from '../utils/authenticate-user';
import { emailSignInForUser, emailPasswordReset } from '../utils/fb-emails';
import { updateNewUserIntoDb } from '../utils/db-helpers';
import { ICompany, mapToCompany } from '../models/Company';

const registerUser = (req: Request, res: Response) => {
    const { email, password, phone } = req.body;

    let userUID: string;

    createUserWithEmailAndPassword(fbAuth, email, password)
        .then(async (data) => {
            try {
                userUID = data.user.uid;

                const batch = db.batch();

                const userDocs = await db
                    .collection('users')
                    .where('email', '==', email)
                    .limit(1)
                    .get();

                if (userDocs.empty) {
                    return res.status(500).json({ error: 'Can not find user' });
                }

                const userInfo: IUser = mapToUser(userDocs.docs[0].id, userDocs.docs[0].data());

                console.log(userInfo);

                batch.set(db.doc(`/users/${userUID}`), {
                    ...userInfo,
                    phone,
                    status: 'Active',
                    statusUpdatedAt: Date.now(),
                });

                batch.delete(db.doc(`/users/${userDocs.docs[0].id}`));

                await batch.commit();

                return res.json({
                    message: 'User created successfully!',
                });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }
        })
        .then(() => {
            return res.json({
                message: 'User created successfully!',
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error });
        });
};

/**
 * Sends a sign in link email to a user who is being registered with the firebase sign in link template
 * At this time the user is not created in the firebase authentication
 * This is a hacky approach for now, will look into doing a more custom email approach
 */
const sendRegisterLink = (req: Request, res: Response) => {
    const userInfo: IUser = req.body;

    const newHiredate = new Date(new Date(userInfo.hireDate as Date).setHours(24, 0, 0, 0));

    emailSignInForUser(fbAuth, userInfo.email)
        .then(() => {
            return updateNewUserIntoDb(userInfo, newHiredate);
        })
        .then(() => {
            return res.json({ message: 'Email link successful', email: userInfo.email });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error });
        });
};

const registerCallback = (req: Request, res: Response) => {
    const { email } = req.query;
    return res.redirect(`${process.env.WEB_CLIENT_DOMAIN}/register?email=${email}`);
};

const signIn = (req: Request, res: Response) => {
    const userLogin: IUserLogin = req.body;

    let cookie: string;
    let userUID: string;
    let userInfo: IUser;
    let companyInfo: ICompany;

    const expiresIn = SESSION_COOKIE_EXPIRY;

    return signInWithEmailAndPassword(fbAuth, userLogin.email, userLogin.password)
        .then((data) => {
            userUID = data.user.uid;
            return data.user.getIdToken();
        })
        .then((tokenId) => {
            return assignSessionCookie(tokenId, expiresIn);
        })
        .then((sessionCookie) => {
            cookie = sessionCookie;
            return db.doc(`/users/${userUID}`).get();
        })
        .then((userData) => {
            userInfo = mapToUser(userData.id, userData.data());

            return db.doc('/company/info').get();
        })
        .then((companyDoc) => {
            companyInfo = mapToCompany(companyDoc.data());

            const cookieOptions = {
                maxAge: expiresIn,
                httpOnly: true,
                secure: true,
                sameSite: 'none' as 'none',
            };
            res.cookie('__session', cookie, cookieOptions);
            return res.json({
                message: 'login successful',
                user: userInfo,
                companyInfo: companyInfo,
            });
        })
        .catch((err) => {
            switch (err.code) {
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    return res.status(403).json({ general: 'Wrong credentials, please try again' });
                default: {
                    console.error(err);
                    return res.status(500).json({ error: err });
                }
            }
        });
};

const deleteAuthUser = (req: Request, res: Response) => {
    const id = req.params.id;

    db.doc(`/users/${id}`)
        .get()
        .then((userData) => {
            const user = userData.data();
            if (user && user.status === 'Active') {
                fbAdmin
                    .auth()
                    .deleteUser(id)
                    .then(() => {
                        return db.doc(`/users/${id}`).delete();
                    })
                    .then(() => {
                        return res.json({ message: 'user successfully deleted' });
                    })
                    .catch((err) => {
                        console.error(err);
                        return res.status(500).json({ error: err });
                    });
            } else {
                db.doc(`/users/${id}`)
                    .delete()
                    .then(() => {
                        return res.json({ message: 'user successfully deleted' });
                    })
                    .catch((err) => {
                        console.error(err);
                        return res.status(500).json({ error: err });
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err });
        });
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
                const userData = await db.doc(`/users/${decodedToken.uid}`).get();
                const companyData = await db.doc('/company/info').get();

                const userInfo: IUser = mapToUser(userData.id, userData.data());
                const companyInfo: ICompany = mapToCompany(companyData.data());

                return res.json({ userInfo: userInfo, companyInfo: companyInfo });
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
