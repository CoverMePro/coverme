import { Request, Response } from 'express';
import { IMessage, INotification, IUser, NotificationType } from 'coverme-shared';
import dbHandler from '../db/db-handler';

const createMessage = async (req: Request, res: Response) => {
    const incomingMessage: IMessage = req.body;
    try {
        const createdMessage: IMessage = await dbHandler.addDocument<IMessage>(
            '/messages',
            incomingMessage
        );

        let users = [];

        if (incomingMessage.for === 'company') {
            users = await dbHandler.getCollectionWithCondition<IUser>('users', 'role', '!=', 'owner');
        } else {
            users = await dbHandler.getCollectionWithCondition<IUser>('users', 'teams', 'array-contains', incomingMessage.for);
        }

        const userIds = users.map(user => user.id);

        const notification: INotification = {
            messageTitle: 'New Message',
            messageType: NotificationType.MESSAGE,
            messageBody: `A new message has been posted by ${incomingMessage.userName}`,
            usersNotified: [...userIds],
        };

        await dbHandler.addDocument<INotification>('notifications', notification);

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
