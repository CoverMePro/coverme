import { Request, Response } from 'express';
import { IUser, IOvertime } from 'coverme-shared';

import {
	SmsMessage,
	SMSApi,
	SmsMessageCollection,
	VoiceApi,
	VoiceMessage,
	VoiceMessageCollection,
} from 'clicksend/api';

import { CLICKSEND_AUTH_TOKEN, CLICKSEND_NUMBER, CLICKSEND_USERNAME } from '../constants';

const formatNumber = (phone: string) => {
	return phone.replace(/[- )(]/g, '');
};

export const sendSms = async (req: Request, res: Response) => {
	try {
		const smsMessage = new SmsMessage();

		smsMessage.from = '+18443682904';
		smsMessage.to = '+12262371409';
		smsMessage.body = 'test message from clicksend!';
		smsMessage.customString = 'test the string';

		var smsApi = new SMSApi('matthew@bytesizecoder.ca', 'A703A887-E13F-CDE7-B0B3-86CEE24DF6C5');

		var smsCollection = new SmsMessageCollection();

		smsCollection.messages = [smsMessage];

		await smsApi.smsSendPost(smsCollection);

		return res.json({ message: 'sms successfully sent' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err });
	}
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

export const sendOvertimeSms = async (user: IUser, overtimeInfo: IOvertime, overtimeId: string) => {
	const bodyTemplate = `Hello ${user.firstName},\n\n There is a shift available: \n ${overtimeInfo.shiftInfo} \n\n from the following team: \n ${overtimeInfo.team} \n\n REPLY 1 if you want to take the shift \n\n REPLY 2 if you do not want the shift`;

	const smsMessage = new SmsMessage();

	smsMessage.from = CLICKSEND_NUMBER;
	smsMessage.to = formatNumber(user.phone);
	smsMessage.body = bodyTemplate;
	smsMessage.customString = `${overtimeId}|${user.id}`;

	var smsApi = new SMSApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	var smsCollection = new SmsMessageCollection();

	smsCollection.messages = [smsMessage];

	await smsApi.smsSendPost(smsCollection);
};

export const sendOvertimeVoice = async (user: IUser, overtime: IOvertime) => {
	const bodyTemplate = `Hello ${
		user.firstName
	}, There is a shift available: ${overtime.shiftInfo.replace(
		'-',
		'until'
	)}. From the following team: ${
		overtime.team
	}. Press 1 if you want to take the shift or Press 2 if you do not want the shift`;

	const voiceApi = new VoiceApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	const voiceMessage = new VoiceMessage();

	voiceMessage.to = formatNumber(user.phone);
	voiceMessage.body = bodyTemplate;
	voiceMessage.requireInput = 1;
	voiceMessage.customString = `${overtime.id!}|${user.id}`;

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
	} \n\n This shift will be updated on your schedule`;

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
	const bodyTemplate = `Hello, You have successfully claimed the following shift: ${overtimeInfo.shiftInfo}. From the following team: ${overtimeInfo.team}. This shift will be updated on your schedule`;

	const voiceApi = new VoiceApi(CLICKSEND_USERNAME, CLICKSEND_AUTH_TOKEN);

	const voiceMessage = new VoiceMessage();

	voiceMessage.to = formatNumber(phone);
	voiceMessage.body = bodyTemplate;

	var voiceCollection = new VoiceMessageCollection();

	voiceCollection.messages = [voiceMessage];

	await voiceApi.voiceSendPost(voiceCollection);
};
