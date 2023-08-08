import { Request, Response } from 'express';
import {
	INotification,
	IOvertime,
	IShift,
	ISickRequest,
	ITeam,
	ITimeOff,
	ITimeOffRequest,
	ITradeRequest,
	IUser,
	NotificationType,
} from 'coverme-shared';
import dbHandler from '../db/db-handler';
import { sendNotificationSms } from '../utils/sms';
import { formatDateTimeOutputString } from '../utils/formatter';
import { getBatch } from '../db/batch-handler';

const handleSmsReplyApprove = async (req: Request, res: Response) => {
	console.log('REPLY APPROVE FROM SMS');
	const smsInfo = req.body;

	const customInfo = (smsInfo.custom_string as string).split('$$');

	const smsTag = customInfo[0];
	const smsValue = customInfo[1];

	console.log(smsTag);
	console.log(smsValue);

	try {
		switch (smsTag) {
			case 'SICK':
				await handleSickSmsReplyApprove(smsValue);
				break;
			case 'TIMEOFF':
				await handleTimeOffSmsReplyApprove(smsValue);
				break;
			case 'OVERTIME':
				await handleOvertimeSmsReplyApprove(smsValue);
				break;
			case 'TRADE':
				await handleTradeSmsReplyApprove(smsValue);
				break;
		}
		console.log('SMS REPLY COMPLETE');
		return res.json({ message: 'sms reply complete' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const handleSmsReplyReject = async (req: Request, res: Response) => {
	console.log('REPLY REJECT FROM SMS');
	const smsInfo = req.body;

	const customInfo = (smsInfo.custom_string as string).split('$$');

	const smsTag = customInfo[0];
	const smsValue = customInfo[1];

	try {
		switch (smsTag) {
			case 'SICK':
				await handleSickSmsReplyReject(smsValue);
				break;
			case 'TIMEOFF':
				await handleTimeOffSmsReplyReject(smsValue);
				break;
			case 'OVERTIME':
				await handleOvertimeSmsReplyReject(smsValue);
				break;
			case 'TRADE':
				await handleTradeSmsReplyReject(smsValue);
				break;
		}
		console.log('SMS REPLY COMPLETE');
		return res.json({ message: 'sms reply complete' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const handleSickSmsReplyApprove = async (smsInfo: string) => {
	const id = smsInfo;
	try {
		await dbHandler.updateDocument<ISickRequest>('sick-requests', id, {
			status: 'Approved',
		});

		const sickRequest = await dbHandler.getDocumentById<ISickRequest>('sick-requests', id);

		const userId = sickRequest.userId;

		await dbHandler.updateDocument<IShift>('shifts', sickRequest.shiftId, {
			userId: 'unclaimed',
		});

		const notification: INotification = {
			messageTitle: 'Sick Request Approved',
			messageType: NotificationType.SICK,
			messageBody: 'Your sick request has been approved.',
			usersNotified: [userId],
			usersSeen: [],
		};

		dbHandler.addDocument<INotification>('notifications', notification);

		const bodyTemplate = `Hello from Cover Me Pro,\n\n Your sick request has been approved.`;

		sendNotificationSms([userId], bodyTemplate);

		// add call out

		const overtimeExists = await dbHandler.documentExistsByCondition(
			'overtime-callouts',
			'shiftId',
			'==',
			sickRequest.shiftId
		);

		if (overtimeExists) {
			throw new Error('A Callout already has been made on this shift');
		}

		const shift = await dbHandler.getDocumentById<IShift>('shifts', sickRequest.shiftId);

		const team = await dbHandler.getDocumentById<ITeam>('teams', shift.teamId);

		const managers = await dbHandler.getCollectionWithCondition<IUser>(
			'users',
			'__name__',
			'in',
			team.managers
		);

		await dbHandler.addDocument<IOvertime>('overtime-callouts', {
			shiftId: shift.id,
			shiftInfo: formatDateTimeOutputString(
				shift.startDateTime as string,
				shift.endDateTime as string
			),
			team: team.id,
			callouts: [],
			phase: 'Internal',
			status: 'Pending',
			allNotifed: false,
			alldeclined: false,
			dateCreated: new Date(),
			managerNumbers: managers.map((manager) => manager.phone),
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const handleTimeOffSmsReplyApprove = async (smsInfo: string) => {
	const id = smsInfo;
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
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const handleOvertimeSmsReplyApprove = async (smsInfo: string) => {
	const customInfo = smsInfo.split('|');

	const overtimeId = customInfo[0];
	const userId = customInfo[1];

	try {
		const overtimeCallout: IOvertime = await dbHandler.getDocumentById<IOvertime>(
			'overtime-callouts',
			overtimeId
		);

		const calloutList = [...overtimeCallout.callouts!];

		const userInListIdx = calloutList.findIndex((user) => user.userId === userId);

		if (userInListIdx != -1) {
			calloutList[userInListIdx].status = 'Accepted';

			await dbHandler.updateDocument('overtime-callouts', overtimeId, {
				callouts: calloutList,
			});
		}
	} catch (error) {
		throw error;
	}
};

const handleTradeSmsReplyApprove = async (smsInfo: string) => {
	const id = smsInfo;

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
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const handleSickSmsReplyReject = async (smsInfo: string) => {
	const customInfo = smsInfo.split('|');

	const id = customInfo[0];
	const userId = customInfo[1];

	try {
		await dbHandler.updateDocument<ISickRequest>('sick-requests', id, {
			status: 'Declined',
		});

		const notification: INotification = {
			messageTitle: 'Sick Request Declined',
			messageType: NotificationType.SICK,
			messageBody: 'Your sick request has been declined.',
			usersNotified: [userId],
			usersSeen: [],
		};

		dbHandler.addDocument<INotification>('notifications', notification);

		const bodyTemplate = `Hello from Cover Me Pro,\n\n Your sick request has been declined. Please contact your manager(s) for clarification.`;

		sendNotificationSms([userId], bodyTemplate);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const handleTimeOffSmsReplyReject = async (smsInfo: string) => {
	const id = smsInfo;

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
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const handleOvertimeSmsReplyReject = async (smsInfo: string) => {
	const customInfo = smsInfo.split('|');

	const overtimeId = customInfo[0];
	const userId = customInfo[1];

	try {
		const overtimeCallout: IOvertime = await dbHandler.getDocumentById<IOvertime>(
			'overtime-callouts',
			overtimeId
		);

		const calloutList = [...overtimeCallout.callouts!];

		const userInListIdx = calloutList.findIndex((user) => user.userId === userId);

		if (userInListIdx != -1) {
			calloutList[userInListIdx].status = 'Rejected';

			await dbHandler.updateDocument('overtime-callouts', overtimeId, {
				callouts: calloutList,
			});
		}
	} catch (error) {
		throw error;
	}
};

const handleTradeSmsReplyReject = async (smsInfo: string) => {
	const id = smsInfo;

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
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export default {
	handleSmsReplyApprove,
	handleSmsReplyReject,
};
