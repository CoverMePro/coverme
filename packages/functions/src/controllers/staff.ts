import { Request, Response } from 'express';
import { IStaff } from 'coverme-shared';
import dbHandler from '../db/db-handler';

const getStaff = (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const staff = dbHandler.getDocumentById<IStaff>('staff', id);
		return res.json(staff);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getAllStaff = async (_: Request, res: Response) => {
	try {
		const staff = await dbHandler.getCollectionsWithSort('staff', 'hireDate', 'asc');
		return res.json(staff);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getStaffFromList = async (req: Request, res: Response) => {
	const staffIds = req.body.staffIds;

	try {
		let staff: IStaff[] = [];

		if (staffIds.length > 0) {
			staff = await dbHandler.getCollectionWithCondition<IStaff>(
				'staff',
				'__name__',
				'in',
				staffIds
			);
		}

		return res.json({ staff });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const updateStaff = async (req: Request, res: Response) => {
	const { id } = req.params;
	let staffInfo: IStaff = req.body;

	try {
		await dbHandler.updateDocument('staff', id, { ...staffInfo });
		return res.json({ message: 'staff updated successfully!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const createStaff = async (req: Request, res: Response) => {
	let staffInfo: IStaff = req.body;

	try {
		await dbHandler.addDocument('staff', { ...staffInfo });
		return res.json({ message: 'staff updated successfully!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const checkStaff = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const exists = await dbHandler.documentExistsById('staff', id);

		return res.json({ exists });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};
const deleteStaff = async (req: Request, res: Response) => {
	const id = req.params.id;
	try {
		await dbHandler.deleteDocument('staff', id);

		return res.json({ message: 'staff member successfully deleted' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

export default {
	getStaff,
	getAllStaff,
	getStaffFromList,
	createStaff,
	updateStaff,
	checkStaff,
	deleteStaff,
};
