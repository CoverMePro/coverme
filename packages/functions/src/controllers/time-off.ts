import { Request, Response } from 'express';
import { INotification, ITeam, ITimeOff, ITimeOffRequest, NotificationType } from 'coverme-shared';
import dbHandler from '../db/db-handler';
import { sendNotificationSms, sendTimeOffSms } from '../utils/sms';
import { formatDateDayOutputString } from '../utils/formatter';

const createTimeOffRequest = async (req: Request, res: Response) => {
	const { timeOffRequest, managers } = req.body;

	timeOffRequest.requestDate = new Date(timeOffRequest.requestDate!);
	timeOffRequest.timeOffStart = new Date(timeOffRequest.timeOffStart!);
	timeOffRequest.timeOffEnd = new Date(timeOffRequest.timeOffEnd!);

	try {
		const timeOffAdded = await dbHandler.addDocument<ITimeOffRequest>(
			'time-off-requests',
			timeOffRequest
		);

		const notification: INotification = {
			messageTitle: 'New Time Off Request',
			messageType: NotificationType.TIMEOFF,
			messageBody: timeOffRequest.user + 'has requested time off.',
			usersNotified: [...managers],
			usersSeen: [],
		};

		dbHandler.addDocument<INotification>('notifications', notification);

		const bodyTemplate = `Hello from Cover Me Pro,\n\n ${
			timeOffRequest.user
		} has requested time off for the following dates: \n
		${formatDateDayOutputString(
			timeOffAdded.timeOffStart.toISOString(),
			timeOffAdded.timeOffEnd.toISOString()
		)}
		\n\n Reply 1 to APPROVE or 2 to DECLINE the request.
        \n You may also go to the Cover Me app to review the request.
		`;

		sendTimeOffSms([...managers], bodyTemplate, timeOffAdded.id);

		return res.json(timeOffAdded);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getAllTimeOffRequest = async (req: Request, res: Response) => {
	try {
		const timeOffRequests = await dbHandler.getCollection<ITimeOffRequest>('time-off-requests');

		return res.json(timeOffRequests);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getTimeOffFromTeams = async (req: Request, res: Response) => {
	const teams = req.body.teams;

	let users: string[] = [];

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

		const timeOffRequests = await dbHandler.getCollectionChainedConditions<ITimeOffRequest>(
			'time-off-requests',
			[
				{
					property: 'userId',
					operator: 'in',
					value: users,
				},
				{
					property: 'status',
					operator: '==',
					value: 'Pending',
				},
			]
		);

		return res.json(timeOffRequests);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getUserTimeOffRequest = async (req: Request, res: Response) => {
	const { user } = req.params;

	try {
		const timeOffRequests = await dbHandler.getCollectionWithCondition<ITimeOffRequest>(
			'time-off-requests',
			'userId',
			'==',
			user
		);

		return res.json(timeOffRequests);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const approveTimeOffRequest = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await dbHandler.updateDocument<ITimeOffRequest>('time-off-requests', id, {
			status: 'Approved',
		});

		const timeOffRequest = await dbHandler.getDocumentById<ITimeOffRequest>(
			'time-off-requests',
			id
		);

		const timeOffData = dbHandler.getData(timeOffRequest);

		await dbHandler.addDocument<ITimeOff>('time-off', {
			name: timeOffData.type,
			startDateTime: timeOffData.timeOffStart,
			endDateTime: timeOffData.timeOffEnd,
			userId: timeOffData.userId,
			userName: timeOffData.userName,
			teams: timeOffData.teams,
		});

		const notification: INotification = {
			messageTitle: 'Time Off Request Approved',
			messageType: NotificationType.TIMEOFF,
			messageBody: 'Your time off request has been approved.',
			usersNotified: [timeOffRequest.userId],
			usersSeen: [],
		};

		dbHandler.addDocument<INotification>('notifications', notification);

		const bodyTemplate = `Hello from Cover Me Pro,\n\n Your time off request has been approved.`;

		sendNotificationSms([timeOffRequest.userId], bodyTemplate);

		return res.json({ message: 'time off request approved.' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const rejectTimeOffRequest = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await dbHandler.updateDocument<ITimeOffRequest>('time-off-requests', id, {
			status: 'Declined',
		});

		const timeOffRequest = await dbHandler.getDocumentById<ITimeOffRequest>(
			'time-off-requests',
			id
		);

		const timeOffData = dbHandler.getData(timeOffRequest);

		await dbHandler.addDocument<ITimeOff>('time-off', {
			name: timeOffData.type,
			startDateTime: timeOffData.timeOffStart,
			endDateTime: timeOffData.timeOffEnd,
			userId: timeOffData.userId,
			userName: timeOffData.userName,
			teams: timeOffData.teams,
		});

		const notification: INotification = {
			messageTitle: 'Time Off Request Rejected',
			messageType: NotificationType.TIMEOFF,
			messageBody: 'Your time off request has been rejected.',
			usersNotified: [timeOffRequest.userId],
			usersSeen: [],
		};

		dbHandler.addDocument<INotification>('notifications', notification);

		const bodyTemplate = `Hello from Cover Me Pro,\n\n Your time off request has been rejected. Please contact manager(s) for clarification.`;

		sendNotificationSms([timeOffRequest.userId], bodyTemplate);

		return res.json({ message: 'time off request declined.' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const deleteTimeOffRequest = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await dbHandler.deleteDocument('time-off', id);
		return res.json({ message: 'Time off request deleted.' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

export default {
	createTimeOffRequest,
	getAllTimeOffRequest,
	getTimeOffFromTeams,
	getUserTimeOffRequest,
	approveTimeOffRequest,
	rejectTimeOffRequest,
	deleteTimeOffRequest,
};
