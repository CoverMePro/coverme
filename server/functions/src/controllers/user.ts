import { Request, Response } from 'express';
import { IUser } from '../models/User';

import { db } from '../utils/admin';

/**
 * Get a user based on their ID
 */
const getUser = (req: Request, res: Response) => {
    db.doc(`/users/${req.params.email}`)
        .get()
        .then((userData) => {
            if (userData.exists) {
                const user: IUser = {
                    ...userData.data(),
                    email: userData.id,
                };
                return res.json(user);
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        })
        .catch((err) => {
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
        .then((data) => {
            const users: IUser[] = [];

            data.forEach((doc) => {
                users.push({
                    ...doc.data(),
                    email: doc.id,
                });
            });

            return res.json({ users });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

/**
 * Get users from a list of emails
 */
const getUsersFromList = (req: Request, res: Response) => {
    const userEmails = req.body.emails;

    db.collection('/users')
        .where('__name__', 'in', userEmails)
        .get()
        .then((userData) => {
            const managers: IUser[] = [];
            const staff: IUser[] = [];
            userData.forEach((user) => {
                if (user.data().role === 'manager') {
                    managers.push({ email: user.id, ...user.data() });
                } else if (user.data().role === 'staff') {
                    staff.push({ email: user.id, ...user.data() });
                }
            });
            return res.json({ managers, staff });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

/**
 * Update user info based on their ID
 */
const updateUser = (req: Request, res: Response) => {
    let userInfo: IUser = req.body;

    db.doc(`/users/${req.params.userId}`)
        .update(userInfo)
        .then(() => {
            return res.json({ message: 'User updated successfully!' });
        })
        .catch((err) => {
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
        .then((userData) => {
            if (userData.exists) {
                return res.json({ exists: true });
            } else {
                return res.json({ exists: true });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    getUser,
    getUsersFromCompany,
    getUsersFromList,
    updateUser,
    checkUser,
};
