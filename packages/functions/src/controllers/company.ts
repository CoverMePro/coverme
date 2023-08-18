import { Request, Response } from 'express';

import { ICompany } from 'coverme-shared';

import { getCalloutList } from '../db/db-helpers';
import dbHandler from '../db/db-handler';

const updateCompany = async (req: Request, res: Response) => {
	let companyInfo: ICompany = req.body;
	try {
		await dbHandler.updateDocument('company', 'info', { ...companyInfo });
		return res.json({ message: 'Company updated succesfully!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
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
	getCompanyOvertimeCalloutList,
	updateCompany,
};
