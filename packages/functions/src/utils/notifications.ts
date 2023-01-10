import { Request, Response } from 'express';
import { messaging } from 'firebase-admin';
import { INotification } from 'coverme-shared';
import { fbAdmin } from './admin';
import dbHandler from '../db/db-handler';
import { PathName } from '../db/PathNames';

export const testNot = (req: Request, res: Response) => {
	const { userId } = req.body;

	console.log('Getting token for: ' + userId);

	dbHandler
		.getDocumentById<any>('message-tokens', userId)
		.then((messageToken) => {
			const token = messageToken.token;

			console.log('TOKEN: ' + token);

			const payload = {
				token: token,
				notification: {
					title: 'cloud function demo',
					body: 'test message!',
				},
				data: {
					body: 'test message!',
				},
			};

			fbAdmin
				.messaging()
				.send(payload)
				.then((response) => {
					return res.json({ message: 'Complete!' });
				})
				.catch((err) => {
					console.error(err);
					return res.status(500).json({ error: err.code });
				});
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

export const sendPushNotification = (notification: INotification) => {
	console.log('sending push notification');
	dbHandler
		.getCollectionWithCondition<any>(
			'message-tokens',
			PathName.Id,
			'in',
			notification.usersNotified
		)
		.then(async (messageTokensRetreiverd) => {
			const messageTokens: string[] = [];

			messageTokensRetreiverd.forEach((messageTokenData) => {
				messageTokens.push(messageTokenData.token);
			});

			console.log(messageTokens);

			const payload: messaging.MessagingPayload = {
				notification: {
					title: notification.messageTitle,
					body: notification.messageBody,
				},
				data: {
					id: notification.id!,
				},
			};

			try {
				await fbAdmin.messaging().sendToDevice(messageTokens, payload);
			} catch (err) {
				console.error(err);
			}
		});
};
