import { Request, Response } from 'express';
import { IUser, IOvertime, IStaff } from 'coverme-shared';

import {
	SmsMessage,
	SMSApi,
	SmsMessageCollection,
	VoiceApi,
	VoiceMessage,
	VoiceMessageCollection,
} from 'clicksend/api';

import { CLICKSEND_AUTH_TOKEN, CLICKSEND_NUMBER, CLICKSEND_USERNAME } from '../constants';
import dbHandler from '../db/db-handler';

const formatNumber = (phone: string) => {
	return phone.replace(/[- )(]/g, '');
};

export const testReceive = async (req: Request, res: Response) => {
	try {
		console.log('RECEIVE REPLY');

		console.log(req.body);
		return res.status(200);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err });
	}
};

export const sendOvertimeSms = async (
	staff: IStaff,
	overtimeInfo: IOvertime,
	overtimeId: string
) => {
	const bodyTemplate = `Hello ${staff.firstName},\n\n There is a shift available: \n ${overtimeInfo.shiftInfo} \n\n from the following team: \n ${overtimeInfo.team} \n\n REPLY 1 if you want to take the shift \n\n REPLY 2 if you do not want the shift`;

	const smsMessage = new SmsMessage();

	smsMessage.from = CLICKSEND_NUMBER;
	smsMessage.to = formatNumber(staff.phone);
	smsMessage.body = bodyTemplate;
	smsMessage.customString = `${overtimeId}|${staff.id}`;

	var smsApi = new SMSApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	var smsCollection = new SmsMessageCollection();

	smsCollection.messages = [smsMessage];

	await smsApi.smsSendPost(smsCollection);
};

export const sendOvertimeVoice = async (staff: IStaff, overtime: IOvertime) => {
	const bodyTemplate = `Hello ${
		staff.firstName
	}, There is a shift available: ${overtime.shiftInfo.replace(
		'-',
		'until'
	)}. From the following team: ${
		overtime.team
	}. Press 1 if you want to take the shift or Press 2 if you do not want the shift`;

	const voiceApi = new VoiceApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	const voiceMessage = new VoiceMessage();

	voiceMessage.to = formatNumber(staff.phone);
	voiceMessage.body = bodyTemplate;
	voiceMessage.requireInput = 1;
	voiceMessage.customString = `${overtime.id!}|${staff.id}`;

	var voiceCollection = new VoiceMessageCollection();

	voiceCollection.messages = [voiceMessage];

	await voiceApi.voiceSendPost(voiceCollection);
};

export const sendConfirmOvertimeSms = async (phone: string, overtimeInfo: IOvertime) => {
	const bodyTemplate = `Hello,\n\n You have successfully claimed the following shift: \n ${overtimeInfo.shiftInfo.replace(
		'-',
		'until'
	)}\n\n from the following team: \n ${
		overtimeInfo.team
	} \n\n Your manager will update the schedule.`;

	const smsMessage = new SmsMessage();

	smsMessage.from = CLICKSEND_NUMBER;
	smsMessage.to = formatNumber(phone);
	smsMessage.body = bodyTemplate;

	var smsApi = new SMSApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	var smsCollection = new SmsMessageCollection();

	smsCollection.messages = [smsMessage];

	await smsApi.smsSendPost(smsCollection);
};

export const sendConfirmOvertimeVoice = async (phone: string, overtimeInfo: IOvertime) => {
	const bodyTemplate = `Hello, You have successfully claimed the following shift: ${overtimeInfo.shiftInfo}. From the following team: ${overtimeInfo.team}. Your manager will update the schedule.`;

	const voiceApi = new VoiceApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	const voiceMessage = new VoiceMessage();

	voiceMessage.to = formatNumber(phone);
	voiceMessage.body = bodyTemplate;

	var voiceCollection = new VoiceMessageCollection();

	voiceCollection.messages = [voiceMessage];

	await voiceApi.voiceSendPost(voiceCollection);
};

export const sendManagerUserAcceptedShift = async (overtimeInfo: IOvertime, user: string) => {
	const bodyTemplate = `Hello,\n\n ${user} has ACCEPTED following shift available: \n ${overtimeInfo.shiftInfo.replace(
		'-',
		'until'
	)}\n\n from the following team: \n ${
		overtimeInfo.team
	} \n\n The shift has been added to ${user} schedule.`;

	var smsCollection = new SmsMessageCollection();

	smsCollection.messages = [];

	overtimeInfo.managerNumbers.forEach((number) => {
		const smsMessage = new SmsMessage();

		smsMessage.from = CLICKSEND_NUMBER;
		smsMessage.to = formatNumber(number);
		smsMessage.body = bodyTemplate;

		smsCollection.messages.push(smsMessage);
	});

	var smsApi = new SMSApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	await smsApi.smsSendPost(smsCollection);
};

export const sendManagerAllUsersNotified = async (overtimeInfo: IOvertime) => {
	const bodyTemplate = `Hello,\n\n All staffed have been NOTIFIED of the following shift available: \n ${overtimeInfo.shiftInfo.replace(
		'-',
		'until'
	)}\n\n from the following team: \n ${
		overtimeInfo.team
	} \n\n The callout will remain open until all have responded.\n\n If you want to stop, go to the overtime call out and manually end.`;

	var smsCollection = new SmsMessageCollection();

	smsCollection.messages = [];

	overtimeInfo.managerNumbers.forEach((number) => {
		const smsMessage = new SmsMessage();

		smsMessage.from = CLICKSEND_NUMBER;
		smsMessage.to = formatNumber(number);
		smsMessage.body = bodyTemplate;

		smsCollection.messages.push(smsMessage);
	});

	var smsApi = new SMSApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	await smsApi.smsSendPost(smsCollection);
};

export const sendManagerAllUsersDeclined = async (overtimeInfo: IOvertime) => {
	const bodyTemplate = `Hello,\n\n All staffed have DECLINED the following shift: \n ${overtimeInfo.shiftInfo.replace(
		'-',
		'until'
	)}\n\n from the following team: \n ${
		overtimeInfo.team
	} \n\n This callout is now closed, you must now manually address this available shift.`;

	var smsCollection = new SmsMessageCollection();

	smsCollection.messages = [];

	overtimeInfo.managerNumbers.forEach((number) => {
		const smsMessage = new SmsMessage();

		smsMessage.from = CLICKSEND_NUMBER;
		smsMessage.to = formatNumber(number);
		smsMessage.body = bodyTemplate;

		smsCollection.messages.push(smsMessage);
	});

	var smsApi = new SMSApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	await smsApi.smsSendPost(smsCollection);
};

export const sendNotificationSms = async (usersIds: string[], message: string) => {
	const users = await dbHandler.getCollectionWithCondition<IUser>(
		'users',
		'__name__',
		'in',
		usersIds
	);

	const numbers: string[] = users.map((user) => user.phone);

	await sendSms(numbers, message);
};

// TO DO: create seperate functions for each sms message (vacation, sick, etc)
// need to have different custom strings for each

export const sendSickSms = async (usersIds: string[], message: string, requestId: string) => {
	const users = await dbHandler.getCollectionWithCondition<IUser>(
		'users',
		'__name__',
		'in',
		usersIds
	);

	const numbers: string[] = users.map((user) => user.phone);

	await sendSms(numbers, message, `SICK$$${requestId}`);
};

export const sendTimeOffSms = async (usersIds: string[], message: string, requestId) => {
	const users = await dbHandler.getCollectionWithCondition<IUser>(
		'users',
		'__name__',
		'in',
		usersIds
	);

	const numbers: string[] = users.map((user) => user.phone);

	await sendSms(numbers, message, `TIMEOFF$$${requestId}`);
};

export const sendTradeSms = async (usersIds: string[], message: string, requestId) => {
	const users = await dbHandler.getCollectionWithCondition<IUser>(
		'users',
		'__name__',
		'in',
		usersIds
	);

	const numbers: string[] = users.map((user) => user.phone);

	await sendSms(numbers, message, `TRADE$$${requestId}`);
};

const sendSms = async (numbers: string[], messageBody: string, customString: string = '') => {
	var smsCollection = new SmsMessageCollection();

	smsCollection.messages = [];

	numbers.forEach((number) => {
		const smsMessage = new SmsMessage();

		smsMessage.from = CLICKSEND_NUMBER;
		smsMessage.to = formatNumber(number);
		smsMessage.body = messageBody;
		smsMessage.customString = customString;

		smsCollection.messages.push(smsMessage);
	});

	var smsApi = new SMSApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	await smsApi.smsSendPost(smsCollection);
};
