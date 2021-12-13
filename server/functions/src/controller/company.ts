import { Request, Response } from 'express';
import { ICompanyInfo } from '../models/Company';
import { db } from '../utils/admin';

const createCompany = (req: Request, res: Response) => {
	const company: ICompanyInfo = req.body;

	db.doc(`/companies/${company.name}`)
		.get()
		.then(companyData => {
			if (companyData.exists) {
				console.log('ALREADY EXIST');
				return res.status(403).json({ error: 'Company with that name already exists' });
			} else {
				return db
					.doc(`/companies/${company.name}`)
					.set(company.data!)
					.then(() => {
						return res.status(201).json({
							message: 'Company Created!'
						});
					})
					.catch(err => {
						console.error(err);
						return res.status(500).json({ error: err.code });
					});
			}
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

const getAllCompanies = (req: Request, res: Response) => {
	db.collection('/companies')
		.get()
		.then(companyData => {
			let companies: string[] = [];
			companyData.forEach(data => {
				companies.push(data.id);
			});

			return res.json(companies);
		});
};

const getCompany = (req: Request, res: Response) => {
	db.doc(`/companies/${req.params.id}`)
		.get()
		.then(companyData => {
			if (companyData.exists) {
				const companyInfo: ICompanyInfo = {
					name: companyData.id,
					data: {
						...companyData.data()
					}
				};
				return res.json(companyInfo);
			} else {
				return res.status(404).json({ error: 'Company not found' });
			}
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

const checkCompany = (req: Request, res: Response) => {
	db.doc(`/companies/${req.params.id}`)
		.get()
		.then(companyData => {
			if (companyData.exists) {
				return res.json({ exists: true });
			} else {
				return res.json({ exists: false });
			}
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

const deleteCompany = (req: Request, res: Response) => {
	db.doc(`/companies/${req.params.id}`)
		.delete()
		.then(() => {
			return res.json({ message: 'Company deleted successfully!' });
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

export default {
	createCompany,
	getCompany,
	checkCompany,
	getAllCompanies,
	deleteCompany
};
