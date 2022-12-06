import { Request, Response } from 'express';
import { messaging } from 'firebase-admin';
import { INotification } from 'coverme-shared';
import { fbAdmin, db } from './admin';

export const testNot = (req: Request, res: Response) => {
    const { userId } = req.body;

    console.log('Getting token for: ' + userId);

    db.doc(`/message-tokens/${userId}`)
        .get()
        .then((messageTokenDoc) => {
            const token = messageTokenDoc.data()!.token;

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
    db.collection('message-tokens')
        .where('__name__', 'in', notification.usersNotified)
        .get()
        .then(async (messageTokenDocs) => {
            const messageTokens: string[] = [];

            messageTokenDocs.docs.forEach((doc) => {
                messageTokens.push(doc.data().token);
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
