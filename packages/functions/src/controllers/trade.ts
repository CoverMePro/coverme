import { Request, Response } from 'express';
import { INotification, IShift, ITeam, ITradeRequest, NotificationType } from 'coverme-shared';
import dbHandler from '../db/db-handler';
import { getBatch } from '../db/batch-handler';
import { sendNotificationSms } from '../utils/sms';

const createTradeRequest = async (req: Request, res: Response) => {
	const tradeRequest: ITradeRequest = req.body;

	tradeRequest.proposedDate = new Date(tradeRequest.proposedDate!);

	try {
		const tradeRequestAdded = await dbHandler.addDocument<ITradeRequest>(
			'trade-requests',
			tradeRequest
		);
		const shifts = await dbHandler.getCollectionWithCondition<IShift>(
			'shifts',
			'__name__',
			'in',
			[tradeRequest.proposedShiftId, tradeRequest.requestedShiftId]
		);

		shifts.forEach((shift) => {
			if (tradeRequestAdded.proposedShiftId === shift.id) {
				tradeRequestAdded.proposedShift = shift;
			}

			if (tradeRequestAdded.requestedShiftId === shift.id) {
				tradeRequestAdded.requestedShift = shift;
			}
		});

		const notification: INotification = {
			messageTitle: 'Trade Request',
			messageType: NotificationType.TRADE,
			messageBody: tradeRequestAdded.proposedUser.name + ' would like to trade shifts.',
			usersNotified: [tradeRequest.requestedUserId],
			usersSeen: [],
		};

		dbHandler.addDocument<INotification>('notifications', notification);

		const bodyTemplate = `Hello from Cover Me Pro,\n\n ${tradeRequestAdded.proposedUser.name} would like to trade shifts, please go to the Cover me app to view the trade request.`;

		sendNotificationSms([tradeRequest.requestedUserId], bodyTemplate);

		return res.json(tradeRequestAdded);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getAllTradeRequests = async (req: Request, res: Response) => {
	try {
		let tradeRequests = await dbHandler.getCollection<ITradeRequest>('trade-requests');
		const shiftIds: string[] = [];

		tradeRequests.forEach((tradeRequest) => {
			if (
				shiftIds.findIndex((shift: string) => shift === tradeRequest.proposedShiftId) === -1
			) {
				shiftIds.push(tradeRequest.proposedShiftId!);
			}

			if (
				shiftIds.findIndex((shift: string) => shift === tradeRequest.requestedShiftId) ===
				-1
			) {
				shiftIds.push(tradeRequest.requestedShiftId!);
			}
		});

		if (shiftIds.length > 0) {
			const shifts = await dbHandler.getCollectionWithCondition<IShift>(
				'shifts',
				'__name__',
				'in',
				shiftIds
			);

			shifts.forEach((shift) => {
				for (let i = 0, len = tradeRequests.length; i < len; ++i) {
					const tradeRequest = tradeRequests[i];

					if (tradeRequest.proposedShiftId === shift.id) {
						tradeRequest.proposedShift = shift;
					}

					if (tradeRequest.requestedShiftId === shift.id) {
						tradeRequest.requestedShift = shift;
					}
				}
			});
		}

		tradeRequests = tradeRequests.sort((a, b) => {
			return new Date(b.proposedDate!).getTime() - new Date(a.proposedDate!).getTime();
		});

		return res.json(tradeRequests);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getUserTradeRequest = async (req: Request, res: Response) => {
	const user = req.params.user;
	const shiftIds: string[] = [];
	try {
		const [proposedTrades, requestedTrades] = await dbHandler.getMultipleCollections([
			dbHandler.getCollectionWithCondition<ITradeRequest>(
				'trade-requests',
				'proposedUserId',
				'==',
				user
			),
			dbHandler.getCollectionWithCondition<ITradeRequest>(
				'trade-requests',
				'requestedUserId',
				'==',
				user
			),
		]);

		let tradeRequests = [...proposedTrades, ...requestedTrades];

		tradeRequests.forEach((tradeRequest) => {
			if (
				shiftIds.findIndex((shift: string) => shift === tradeRequest.proposedShiftId) === -1
			) {
				shiftIds.push(tradeRequest.proposedShiftId!);
			}

			if (
				shiftIds.findIndex((shift: string) => shift === tradeRequest.requestedShiftId) ===
				-1
			) {
				shiftIds.push(tradeRequest.requestedShiftId!);
			}
		});

		if (shiftIds.length > 0) {
			const shifts = await dbHandler.getCollectionWithCondition<IShift>(
				'shifts',
				'__name__',
				'in',
				shiftIds
			);

			shifts.forEach((shift) => {
				for (let i = 0, len = tradeRequests.length; i < len; ++i) {
					const tradeRequest = tradeRequests[i];

					if (tradeRequest.proposedShiftId === shift.id) {
						tradeRequest.proposedShift = shift;
					}

					if (tradeRequest.requestedShiftId === shift.id) {
						tradeRequest.requestedShift = shift;
					}
				}
			});
		}

		tradeRequests = tradeRequests.sort((a, b) => {
			return new Date(b.proposedDate!).getTime() - new Date(a.proposedDate!).getTime();
		});

		return res.json(tradeRequests);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getTradeRequestsFromTeam = async (req: Request, res: Response) => {
	const teams = req.body.teams;

	let users: string[] = [];
	const shiftIds: string[] = [];

	try {
		const retreivedTeams = await dbHandler.getCollectionWithCondition<ITeam>(
			'teams',
			'__name__',
			'in',
			teams
		);

		retreivedTeams.forEach((team) => {
			if (team.staff) {
				users = [...users, ...team.staff];
			}
		});

		const [proposedTrades, requestedTrades] = await dbHandler.getMultipleCollections([
			dbHandler.getCollectionWithCondition<ITradeRequest>(
				'trade-requests',
				'proposedUserId',
				'in',
				users
			),
			dbHandler.getCollectionWithCondition<ITradeRequest>(
				'trade-requests',
				'requestedUserId',
				'in',
				users
			),
		]);

		let tradeRequests = [...proposedTrades, ...requestedTrades];

		tradeRequests.forEach((tradeRequest) => {
			if (
				shiftIds.findIndex((shift: string) => shift === tradeRequest.proposedShiftId) === -1
			) {
				shiftIds.push(tradeRequest.proposedShiftId!);
			}

			if (
				shiftIds.findIndex((shift: string) => shift === tradeRequest.requestedShiftId) ===
				-1
			) {
				shiftIds.push(tradeRequest.requestedShiftId!);
			}
		});

		if (shiftIds.length > 0) {
			const shifts = await dbHandler.getCollectionWithCondition<IShift>(
				'shifts',
				'__name__',
				'in',
				shiftIds
			);

			shifts.forEach((shift) => {
				for (let i = 0, len = tradeRequests.length; i < len; ++i) {
					const tradeRequest = tradeRequests[i];

					if (tradeRequest.proposedShiftId === shift.id) {
						tradeRequest.proposedShift = shift;
					}

					if (tradeRequest.requestedShiftId === shift.id) {
						tradeRequest.requestedShift = shift;
					}
				}
			});
		}

		tradeRequests = tradeRequests.sort((a, b) => {
			return new Date(b.proposedDate!).getTime() - new Date(a.proposedDate!).getTime();
		});

		return res.json(tradeRequests);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const deleteTradeRequest = async (req: Request, res: Response) => {
	const id = req.params.id;
	try {
		await dbHandler.deleteDocument('trade-request', id);
		return res.json({ message: 'trade request deleted.' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const acceptTradeRequest = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const tradeRequest = await dbHandler.getDocumentById<ITradeRequest>('trade-requests', id);

		const batch = getBatch();

		batch.update(dbHandler.getDocumentSnapshot(`/shifts/${tradeRequest.proposedShiftId}`), {
			userId: tradeRequest.requestedUserId,
		});

		batch.update(dbHandler.getDocumentSnapshot(`/shifts/${tradeRequest.requestedShiftId}`), {
			userId: tradeRequest.proposedUserId,
		});

		batch.update(dbHandler.getDocumentSnapshot(`/trade-requests/${id}`), {
			status: 'Approved',
		});

		await batch.commit();

		const notification: INotification = {
			messageTitle: 'Trade Accepted',
			messageType: NotificationType.TRADE,
			messageBody: tradeRequest.requestedUser + ' has accepted your trade.',
			usersNotified: [tradeRequest.proposedUserId],
			usersSeen: [],
		};

		dbHandler.addDocument<INotification>('notifications', notification);

		const bodyTemplate = `Hello from Cover Me Pro,\n\n ${tradeRequest.requestedUser} has accepted your trade request, the schedule has now changed to reflect this.`;

		sendNotificationSms([tradeRequest.requestedUserId], bodyTemplate);

		return res.json({ message: 'trade has been made successfully' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const rejectTradeRequest = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		await dbHandler.updateDocument<ITradeRequest>('trade-requests', id, {
			status: 'Rejected',
		});

		const tradeRequest = await dbHandler.getDocumentById<ITradeRequest>('trade-requests', id);

		const notification: INotification = {
			messageTitle: 'Trade Rejected',
			messageType: NotificationType.TRADE,
			messageBody: tradeRequest.requestedUser + ' has rejected your trade.',
			usersNotified: [tradeRequest.proposedUserId],
			usersSeen: [],
		};

		dbHandler.addDocument<INotification>('notifications', notification);

		const bodyTemplate = `Hello from Cover Me Pro,\n\n ${tradeRequest.requestedUser} has rejected your trade request.`;

		sendNotificationSms([tradeRequest.requestedUserId], bodyTemplate);

		return res.json({ message: 'trade request rejectred.' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const archiveTradeRequest = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const tradeRequests = await dbHandler.getDocumentById<ITradeRequest>('trade-requests', id);

		if (tradeRequests.archiveUsers) {
			tradeRequests.archiveUsers.push(req.body.user);
		} else {
			tradeRequests.archiveUsers = [req.body.user];
		}

		await dbHandler.setDocument('trade-requets', id, {
			...dbHandler.getData(tradeRequests),
		});

		return res.json({ message: 'archived successfully' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

export default {
	createTradeRequest,
	getAllTradeRequests,
	getUserTradeRequest,
	deleteTradeRequest,
	acceptTradeRequest,
	rejectTradeRequest,
	archiveTradeRequest,
	getTradeRequestsFromTeam,
};
