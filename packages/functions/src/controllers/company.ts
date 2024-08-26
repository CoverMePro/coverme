import { Request, Response } from 'express';

import { ICompany } from '../coverme-shared';

import dbHandler from '../db/db-handler';

/**
 * @api {post} /api/company Update Company Information
 * @apiName updateCompany
 * @apiGroup Company
 *
 * @apiDescription Updates the information on the company.
 *
 * @apiBody {Object} companyInfo The user Data to update, which contains company name, phone number, and email
 *
 * @apiSuccess {Object} result The success result object.
 * @apiSuccess {String} result.message Success message.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
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

export default {
	updateCompany,
};
