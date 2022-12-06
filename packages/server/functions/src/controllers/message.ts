import { Request, Response } from 'express';
import { IMessage } from 'coverme-shared';
import dbHandler from '../db/db-handler';

const createMessage = async (req: Request, res: Response) => {
    const incomingMessage: IMessage = req.body;
    try {
        const createdMessage: IMessage = await dbHandler.addDocument<IMessage>(
            '/messages',
            incomingMessage
        );
        return res.json(createdMessage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const getMessages = async (_: Request, res: Response) => {
    try {
        const messages: IMessage[] = await dbHandler.getCollectionsWithSort<IMessage>(
            'messages',
            'date',
            'desc'
        );

        return res.json(messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

export default {
    createMessage,
    getMessages,
};
