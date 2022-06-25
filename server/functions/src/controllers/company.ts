import { Request, Response } from 'express';

import { ICompany, mapToCompany } from '../models/Company';
import { ILastCallouts } from '../models/LastCallout';
import { IUser, mapToUser } from '../models/User';

import { db, fbAuth } from '../utils/admin';
import { getCalloutList, updateNewUserIntoDb } from '../utils/db-helpers';
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

const getAllCompanies = (_: Request, res: Response) => {
    db.collection('/companies')
        .get()
        .then((companyDocs) => {
            let companies: any[] = [];

            companyDocs.forEach((doc) => {
                companies.push(mapToCompany(doc.id, doc.data()));
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
                const companyInfo: ICompany = mapToCompany(companyDoc.id, companyDoc.data());
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
            const ownerUser: IUser = mapToUser(ownerEmail, { ...ownerInfo, phone: '' });
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

const deleteCompany = (req: Request, res: Response) => {
    db.doc(`/companies/${req.params.name}`)
        .delete()
        .then(() => {
            return res.json({ message: 'Company deleted successfully!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

/**
 * Get Overtime List of Users from a company
 */
const getCompanyOvertimeCalloutList = (req: Request, res: Response) => {
    const company = req.params.name;
    getCalloutList(company)
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
    getAllCompanies,
    deleteCompany,
    getCompanyOvertimeCalloutList,
};
