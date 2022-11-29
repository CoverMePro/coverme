import { Request, Response } from 'express';
import { IMessage, mapToMessage } from '../models/Message';
import { db } from '../utils/admin';
import { formatFirestoreData } from '../utils/db-helpers';

const createMessage = (req: Request, res: Response) => {
    const message: IMessage = req.body;
    message.date = new Date(message.date);

    db.collection('/messages')
        .add(message)
        .then((messageDocResult) => {
            return db.doc(`/messages/${messageDocResult.id}`).get();
        })
        .then((messageDoc) => {
            const retreivedMessage = mapToMessage(messageDoc.id, messageDoc.data());

            return res.json({ message: retreivedMessage });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getMessages = (_: Request, res: Response) => {
    db.collection(`/messages`)
        .orderBy('date', 'desc')
        .get()
        .then((messageDocs) => {
            const messages: IMessage[] = formatFirestoreData(messageDocs, mapToMessage);

            return res.json(messages);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    createMessage,
    getMessages,
};
