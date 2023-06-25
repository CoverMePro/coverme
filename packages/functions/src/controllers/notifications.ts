import { INotification } from 'coverme-shared';
import { Request, Response } from 'express';
import { getBatch } from '../db/batch-handler';
import dbHandler from '../db/db-handler';

const getNotifications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const notifications: INotification[] =
            await dbHandler.getCollectionWithCondition<INotification>(
                'notifications',
                'usersNotified',
                'array-contains',
                userId
            );

        return res.json(notifications);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const acknowledgeNotification = async (req: Request, res: Response) => {
    const { notificationId, userId } = req.body;

    try {
        const notificaiton: INotification = await dbHandler.getDocumentById<INotification>(
            'notifications',
            notificationId
        );

        const usersNotified = notificaiton.usersNotified!.filter((user) => user !== userId);

        if (usersNotified.length > 0) {
            await dbHandler.updateDocument('notifications', notificationId, {
                usersNotified: usersNotified,
            });
        } else {
            await dbHandler.deleteDocument('notifications', notificationId);
        }

        return res.json({ message: 'notification acknowledged!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const acknowledgeNotifications = async (req: Request, res: Response) => {
    const { notificationIds, userId } = req.body;

    const batch = getBatch();

    try {
        for await (const notId of notificationIds) {
            const notificaiton = await dbHandler.getDocumentById<INotification>(
                'notifications',
                notId
            );

            const usersNotified = notificaiton.usersNotified!.filter((user) => user !== userId);

            if (usersNotified.length > 0) {
                batch.update(dbHandler.getDocumentSnapshot(`/notifications/${notId}`), {
                    usersNotified: usersNotified,
                });
            } else {
                batch.delete(dbHandler.getDocumentSnapshot(`/notifications/${notId}`));
            }
        };

        await batch.commit();

        return res.json({ message: 'notifications acknowledged!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
};

const seenNotifications = async (req: Request, res: Response) => {
    const { notificationIds, userId } = req.body;

    const batch = getBatch();

    try {
        for await (const notId of notificationIds) {
            const notificaiton = await dbHandler.getDocumentById<INotification>(
                'notifications',
                notId
            );

            const usersSeen = notificaiton.usersSeen ? notificaiton.usersSeen : [];
    
            batch.update(dbHandler.getDocumentSnapshot(`/notifications/${notId}`), {
                usersSeen: [...usersSeen, userId],
            });
        };

        await batch.commit();

        return res.json({ message: 'notifications seen!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }

}

export default {
    getNotifications,
    acknowledgeNotification,
    acknowledgeNotifications,
    seenNotifications
};
