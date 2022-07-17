import { Request, Response } from 'express';
import { IUser, mapToUser } from '../models/User';
import { db } from '../utils/admin';

import { Twilio, twiml } from 'twilio';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } from '../constants';

const formatNumber = (phone: string) => {
    return phone.replace(/[- )(]/g, '');
};

export const sendSms = (req: Request, res: Response) => {
    const userId = req.body.userId;

    db.doc(`/users/${userId}`)
        .get()
        .then(async (userDoc) => {
            if (!userDoc.exists) {
                return res.status(403).json({ error: 'No user exists' });
            }
            try {
                const user: IUser = mapToUser(userDoc.id, userDoc.data());

                const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

                const message = await client.messages.create({
                    from: TWILIO_NUMBER,
                    to: formatNumber(user.phone),
                    body: `Hello ${user.firstName} ${user.lastName}! Test send sms from twilio!`,
                    addressRetention: 'retain',
                });

                console.log(message.sid);
                console.log(message);

                return res.json({ message: 'sms successfully sent' });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }
        });
};

export const replySms = async (req: Request, res: Response) => {
    const { MessagingResponse } = twiml;

    const fromPhone = req.body.From;
    const message = req.body.Body;

    console.log(req.body);

    console.log((fromPhone as string).trim());

    return db
        .collection('/users')
        .where('phone', '==', fromPhone)
        .get()
        .then(async (userDocs) => {
            if (userDocs.empty) {
                console.log('Cant find user!');
                return res.status(403).json({ error: 'No user exists' });
            }

            const user = mapToUser(userDocs.docs[0].id, userDocs.docs[0].data());
            console.log(user);
            if (!user) {
                console.log('Unsuccessful user!!');
                return res.status(403).json({ error: 'No user exists' });
            }

            const response = new MessagingResponse();
            response.message(`Hello ${user.firstName} ${user.lastName}! You said "${message}"`);

            res.set('Content-Type', 'application/xml');
            return res.send(response.toString());
        });
};
