import { Request, Response } from 'express';
import { IOvertime } from 'coverme-shared';
import { getCalloutList } from '../db/db-helpers';
import calloutCyle from '../utils/overtime';
import dbHandler from '../db/db-handler';

const createOvertimeCallout = async (req: Request, res: Response) => {
	const overtimeCallout: IOvertime = req.body;

	try {
		const overtimeExists = await dbHandler.documentExistsByCondition(
			'overtime-callouts',
			'shiftId',
			'==',
			overtimeCallout.shiftId
		);

		if (overtimeExists) {
			return res.status(403).json({ error: 'A Callout already has been made on this shift' });
		}

		const addedOvertime: IOvertime = await dbHandler.addDocument<IOvertime>(
			'overtime-callouts',
			{
				...overtimeCallout,
				dateCreated: new Date(),
			}
		);

		return res.json({ overtimeCallout: addedOvertime });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getOvertimeCallouts = async (req: Request, res: Response) => {
	try {
		const overtimeCallouts = await dbHandler.getCollectionsWithSort<IOvertime>(
			'ovetime-callouts',
			'dateCreated',
			'asc'
		);

		return res.json({ overtimeCallouts: overtimeCallouts });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getOvertimeCalloutInfo = async (req: Request, res: Response) => {
	const { user, id } = req.params;

	try {
		const overtimeCallout = await dbHandler.getDocumentFromCollectionWithCondition<IOvertime>(
			'overtime-callouts',
			'__name__',
			'==',
			id
		);

		let hasBeenReached = false;
		let hasAnswered = false;

		overtimeCallout.callouts.forEach((callout) => {
			if (callout.userId === user) {
				hasBeenReached = true;

				if (callout.status !== 'Pending') {
					hasAnswered = true;
				}
			}
		});

		if (!hasBeenReached) {
			// ERROR: NOT CONTACTED
			return res.status(400).json({ error: 'NOT_CONTACTED' });
		}

		if (hasAnswered) {
			// ERROR: ALREADY ANSWERED
			return res.status(409).json({ error: 'ALREADY_ANSWERED' });
		}

		return res.json(overtimeCallout);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const acceptCalloutShift = async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = req.body.userId;

	try {
		const overtimeCallout: IOvertime = await dbHandler.getDocumentById<IOvertime>(
			'overtime-callouts',
			id
		);

		const calloutList = [...overtimeCallout.callouts!];

		const userInListIdx = calloutList.findIndex((user) => user.userId === userId);

		if (userInListIdx != -1) {
			calloutList[userInListIdx].status = 'Accepted';

			await dbHandler.updateDocument('overtime-callouts', id, {
				callouts: calloutList,
			});

			return res.json({ message: 'shift has been accepted' });
		}

		return res.status(500).json({ error: 'No user found in callout request' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const rejectedCalloutShift = async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = req.body.userId;

	try {
		const overtimeCallout = await dbHandler.getDocumentById<IOvertime>('overtime-callouts', id);

		const calloutList = [...overtimeCallout.callouts!];

		const userInListIdx = calloutList.findIndex((user) => user.userId === userId);

		if (userInListIdx != -1) {
			calloutList[userInListIdx].status = 'Rejected';

			await dbHandler.updateDocument('overtime-callouts', id, {
				callouts: calloutList,
			});

			return res.json({ message: 'shift has been rejected' });
		}

		return res.status(500).json({ error: 'No user found in callout request' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const testCycleCallout = (_: Request, res: Response) => {
	calloutCyle()
		.then(() => {
			return res.json({ message: 'callout round complete' });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err });
		});
};

const getCompanyOvertimeCalloutList = (_: Request, res: Response) => {
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
	createOvertimeCallout,
	getOvertimeCallouts,
	getOvertimeCalloutInfo,
	acceptCalloutShift,
	rejectedCalloutShift,
	testCycleCallout,
	getCompanyOvertimeCalloutList,
};
