import { Request, Response } from 'express';
import { IShiftTemplate } from 'coverme-shared';
import dbHandler from '../db/db-handler';

const createShiftTemplate = async (req: Request, res: Response) => {
	const shiftTemplateToAdd: IShiftTemplate = req.body;

	try {
		const addedShiftTemplate: IShiftTemplate = await dbHandler.addDocument<IShiftTemplate>(
			'shift-templates',
			shiftTemplateToAdd
		);

		return res.json(addedShiftTemplate);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const deleteShiftTemplate = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		await dbHandler.deleteDocument('shift-templates', id);
		return res.json({ message: 'Shift template deleted!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getShiftTemplates = async (_: Request, res: Response) => {
	try {
		const shiftTemplates = await dbHandler.getCollection<IShiftTemplate>('shift-templates');

		return res.json(shiftTemplates);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

export default {
	createShiftTemplate,
	deleteShiftTemplate,
	getShiftTemplates,
};
