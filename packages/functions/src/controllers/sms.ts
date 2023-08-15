import { Request, Response } from 'express';
import { IOvertime } from 'coverme-shared';
import dbHandler from '../db/db-handler';

const handleSmsReplyApprove = async (req: Request, res: Response) => {
	console.log('REPLY APPROVE FROM SMS');
	const smsInfo = req.body;

	const customInfo = (smsInfo.custom_string as string).split('$$');

	const smsTag = customInfo[0];
	const smsValue = customInfo[1];

	try {
		switch (smsTag) {
			case 'OVERTIME':
				await handleOvertimeSmsReplyApprove(smsValue);
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
			case 'OVERTIME':
				await handleOvertimeSmsReplyReject(smsValue);
				break;
		}
		console.log('SMS REPLY COMPLETE');
		return res.json({ message: 'sms reply complete' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
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

export default {
	handleSmsReplyApprove,
	handleSmsReplyReject,
};
