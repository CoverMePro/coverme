import { Request, Response } from 'express';

import { ICompany, ILastCallouts, IUser } from 'coverme-shared';

import { db, fbAuth, fbAdmin } from '../utils/admin';
import { getCalloutList, mapFireStoreData, updateNewUserIntoDb } from '../db/db-helpers';
import { emailSignInForUser } from '../utils/fb-emails';

const getAllCompanyNames = (_: Request, res: Response) => {
    db.collection('/companies')
        .get()
        .then((companyDocs) => {
            let companies: string[] = [];

            companyDocs.forEach((doc) => {
                companies.push(doc.id);
            });

            return res.json(companies);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err });
        });
};

const getCompany = (req: Request, res: Response) => {
    db.doc(`/companies/${req.params.name}`)
        .get()
        .then((companyDoc) => {
            if (companyDoc.exists) {
                const companyInfo: ICompany = mapFireStoreData(
                    companyDoc.id,
                    companyDoc.data(),
                    false
                );
                return res.json(companyInfo);
            } else {
                return res.status(404).json({ error: 'Company not found' });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const checkIfCompanyExist = (req: Request, res: Response) => {
    db.doc(`/companies/${req.params.name}`)
        .get()
        .then((companyData) => {
            if (companyData.exists) {
                return res.json({ exists: true });
            } else {
                return res.json({ exists: false });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const createCompany = async (req: Request, res: Response) => {
    const companyName = req.body.company.name;
    const companyInfo = req.body.company.data;

    const ownerEmail = req.body.owner.email;
    const ownerInfo = req.body.owner.data;

    const lastCallouts: ILastCallouts = {
        external: {
            email: '',
        },
        internal: {},
    };

    companyInfo.lastCallouts = lastCallouts;

    db.doc(`/companies/${companyName}`)
        .get()
        .then((companyData) => {
            if (companyData.exists) {
                throw 403;
            } else {
                return db.doc(`/companies/${companyName}`).set(companyInfo);
            }
        })
        .then(() => {
            return emailSignInForUser(fbAuth, ownerEmail);
        })
        .then(() => {
            const ownerUser: IUser = mapFireStoreData(ownerEmail, { ...ownerInfo, phone: '' });
            return updateNewUserIntoDb(ownerUser, new Date());
        })
        .then(() => {
            return res.status(201).json({
                message: 'Company Created!',
            });
        })
        .catch((err) => {
            if (err === 403) {
                return res.status(403).json({ error: 'Company with that name already exists' });
            } else {
                console.error(err);
                return res.status(500).json({ error: err.code });
            }
        });
};

const deleteCompany = async (req: Request, res: Response) => {
    const company = req.params.name;
    const batch = db.batch();

    const userEmails: any = [];
    try {
        await db
            .collection('/users')
            .where('company', '==', company)
            .get()
            .then((userDocs) => {
                userDocs.forEach((userDoc) => {
                    userEmails.push({ email: userDoc.id });
                    batch.delete(db.doc(`/users/${userDoc.id}`));
                });
            });

        await db
            .collection('/overtime-callouts')
            .where('company', '==', company)
            .get()
            .then((overtimeDocs) => {
                overtimeDocs.forEach((overtimeDoc) => {
                    batch.delete(db.doc(`/overtime-callouts/${overtimeDoc.id}`));
                });
            });

        batch.delete(db.doc(`/companies/${req.params.name}`));

        await batch.commit();

        const userResults = await fbAdmin.auth().getUsers(userEmails);

        const batchDeleteUsers: any = [];

        userResults.users.forEach((user) => {
            batchDeleteUsers.push(user);
        });

        await fbAdmin.auth().deleteUsers(batchDeleteUsers);

        return res.json({ message: 'Company successfully deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
};

/**
 * Get Overtime List of Users from a company
 */
const getCompanyOvertimeCalloutList = (req: Request, res: Response) => {
    getCalloutList()
        .then(({ users, lastCallouts }) => {
            return res.json({ users: users, lastCallouts: lastCallouts });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    createCompany,
    getCompany,
    checkIfCompanyExist,
    getAllCompanyNames,
    deleteCompany,
    getCompanyOvertimeCalloutList,
};
