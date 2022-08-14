import { Request, Response } from 'express';
import { IUser, mapToUser } from '../models/User';

import { db } from '../utils/admin';
import { formatFirestoreData } from '../utils/db-helpers';

/**
 * Get a user based on their ID
 */
const getUser = (req: Request, res: Response) => {
    db.doc(`/users/${req.params.email}`)
        .get()
        .then((userData) => {
            if (userData.exists) {
                const user: IUser = mapToUser(userData.id, userData.data());
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

const getAllUsers = (_: Request, res: Response) => {
    db.collection('users')
        .where('role', '!=', 'owner')
        .get()
        .then((userDocs) => {
            const users: IUser[] = formatFirestoreData(userDocs, mapToUser);

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
                    managers.push(mapToUser(user.id, user.data()));
                } else if (user.data().role === 'staff') {
                    staff.push(mapToUser(user.id, user.data()));
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
    getAllUsers,
    getUsersFromList,
    updateUser,
    checkUser,
};
