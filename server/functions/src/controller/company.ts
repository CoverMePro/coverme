import { Request, Response } from 'express';
import { ICompanyInfo } from '../models/Company';
import { db, fbAuth } from '../utils/admin';
import { emailSignInForUser } from '../utils/fb-emails';

/**
 * Get all companies in the database
 */
const getAllCompanies = (req: Request, res: Response) => {
    db.collection('/companies')
        .get()
        .then((companyData) => {
            let companies: string[] = [];
            companyData.forEach((data) => {
                companies.push(data.id);
            });

            return res.json(companies);
        })
        .catch((err) => {
            console.error(err);
        });
};

const getAllCompaniesInfo = (req: Request, res: Response) => {
    db.collection('/companies')
        .get()
        .then((companyData) => {
            let companies: any[] = [];
            companyData.forEach((data) => {
                companies.push({
                    name: data.id,
                    email: data.data().email,
                    phoneNo: data.data().phone,
                });
            });

            return res.json(companies);
        })
        .catch((err) => {
            console.error(err);
        });
};

/**
 * Get a company based on their ID (name)
 */
const getCompany = (req: Request, res: Response) => {
    db.doc(`/companies/${req.params.id}`)
        .get()
        .then((companyData) => {
            if (companyData.exists) {
                const companyInfo: ICompanyInfo = {
                    name: companyData.id,
                    data: {
                        ...companyData.data(),
                    },
                };
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

/**
 * A check if a company name already exist in database (for creating company)
 */
const checkCompany = (req: Request, res: Response) => {
    db.doc(`/companies/${req.params.id}`)
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

/**
 * Creates a company and a user who owns the company (defaulted to manager role)
 */
const createCompany = async (req: Request, res: Response) => {
    const companyName = req.body.company.name;
    const companyInfo = req.body.company.data;

    const ownerEmail = req.body.owner.email;
    const ownerInfo = req.body.owner.data;

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
            return emailSignInForUser(fbAuth, {
                email: ownerEmail,
                ...ownerInfo,
                companyName,
            });
        })
        .then(() => {
            return db.doc(`/users/${ownerEmail}`).set({
                ...ownerInfo,
                status: 'Pending',
                statusUpdatedAt: Date.now(),
            });
        })
        .then(() => {
            return res.status(201).json({
                message: 'Company Created!',
            });
        })
        .catch((err) => {
            console.error(err);
            if (err === 403) {
                return res.status(403).json({ error: 'Company with that name already exists' });
            } else {
                return res.status(500).json({ error: err.code });
            }
        });
};

/**
 * Delete a company based on the ID (name)
 */
const deleteCompany = (req: Request, res: Response) => {
    db.doc(`/companies/${req.params.id}`)
        .delete()
        .then(() => {
            return res.json({ message: 'Company deleted successfully!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    createCompany,
    getCompany,
    checkCompany,
    getAllCompanies,
    getAllCompaniesInfo,
    deleteCompany,
};
