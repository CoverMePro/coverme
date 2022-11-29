import { Request, Response } from 'express';
import { IUser, mapToUser } from '../models/User';
import { db } from '../utils/admin';

import { Twilio } from 'twilio';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } from '../constants';
import { IOvertime } from '../models/Overtime';

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

                await client.messages.create({
                    from: TWILIO_NUMBER,
                    to: formatNumber(user.phone),
                    body: `Hello ${user.firstName} ${user.lastName}! Test send sms from twilio!`,
                });

                return res.json({ message: 'sms successfully sent' });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }
        });
};

export const sendOvertimeSms = (user: IUser, overtimeInfo: IOvertime, overtimeId: string) => {
    const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const link = `${process.env.WEB_CLIENT_DOMAIN}/overtime-confirmation?user=${user.id}&overtimeId=${overtimeId}`;

    const bodyTemplate = `Hello,\n\n There is a shift available: \n ${overtimeInfo.shiftInfo} \n\n from the following team: \n ${overtimeInfo.team} \n\n Please go to the link below if you wish to accept this shift \n\n ${link}`;

    return client.messages
        .create({
            from: TWILIO_NUMBER,
            to: formatNumber(user.phone),
            body: bodyTemplate,
        })
        .catch((err) => {
            throw new Error(err);
        });
};

export const sendConfirmOvertimeSms = (phone: string, overtimeInfo: IOvertime) => {
    const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const bodyTemplate = `Hello,\n\n You have successfully claimed the following shift: \n ${overtimeInfo.shiftInfo}\n\n from the following team: \n ${overtimeInfo.team} \n\n This shift will be updated on your schedule`;

    return client.messages
        .create({
            from: TWILIO_NUMBER,
            to: formatNumber(phone),
            body: bodyTemplate,
        })
        .catch((err) => {
            throw new Error(err);
        });
};
