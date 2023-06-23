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
		const staff = await dbHandler.getCollectionWithCondition('staff', 'role', '!=', 'owner');
		return res.json(staff);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

// const getStaffFromList = async (req: Request, res: Response) => {
//     const userEmails = req.body.emails;

//     try {
//         const users = await dbHandler.getCollectionWithCondition<IStaff>(
//             'users',
//             '__name__',
//             'in',
//             userEmails
//         );

//         const managers: IStaff[] = [];
//         const staff: IStaff[] = [];
//         users.forEach((user) => {
//             if (user.role === 'manager') {
//                 managers.push(user);
//             } else if (user.role === 'staff') {
//                 staff.push(user);
//             }
//         });

//         return res.json({ managers, staff });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: error });
//     }
// };

const updateStaff = async (req: Request, res: Response) => {
	const { staffId } = req.params;
	let staffInfo: IStaff = req.body;

	try {
		await dbHandler.updateDocument('staff', staffId, { ...staffInfo });
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

export default {
	getStaff,
	getAllStaff,
	//	getStaffFromList,
	updateStaff,
	checkStaff,
};
