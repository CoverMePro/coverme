import { Request, Response } from 'express';
import { fbAdmin } from './admin';

export const testNot = (req: Request, res: Response) => {
    const payload = {
        token: process.env.FB_CM_KEY!,
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
};
