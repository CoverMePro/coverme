import { Request, Response } from 'express';
import { INotification, mapToNotification } from '../models/Notification';
import { db } from '../utils/admin';
import { formatFirestoreData } from '../utils/db-helpers';

const getNotifications = (req: Request, res: Response) => {
    const { userId } = req.params;

    console.log(userId);

    db.collection('notifications')
        .where('usersNotified', 'array-contains', userId)
        .get()
        .then((notificationDocs) => {
            const notifications: INotification[] = formatFirestoreData(
                notificationDocs,
                mapToNotification
            );

            console.log(notifications);

            return res.json({ notifications: notifications });
        })
        .catch((err) => {
            return res.status(500).json({ error: err.code });
        });
};

const acknowledgeNotification = (req: Request, res: Response) => {
    const { notificationId, userId } = req.body;

    db.doc(`/notifications/${notificationId}`)
        .get()
        .then((notificationDoc) => {
            const notificaiton: INotification = mapToNotification(
                notificationDoc.id,
                notificationDoc.data()
            );

            const usersNotified = notificaiton.usersNotified.filter((user) => user !== userId);

            return db.doc(`/notifications/${notificationId}`).update({
                usersNotified: usersNotified,
            });
        })
        .then(() => {
            return res.json({ message: 'notification acknowledged!' });
        })
        .catch((err) => {
            return res.status(500).json({ error: err.code });
        });
};

const acknowledgeNotifications = async (req: Request, res: Response) => {
    const { notificationIds, userId } = req.body;

    const batch = db.batch();

    try {
        notificationIds.forEach(async (notId: string) => {
            const notificationDoc = await db.doc(`/notifications/${notId}`).get();

            const notificaiton: INotification = mapToNotification(
                notificationDoc.id,
                notificationDoc.data()
            );

            const usersNotified = notificaiton.usersNotified.filter((user) => user !== userId);

            if (usersNotified.length > 0) {
                batch.update(db.doc(`/notifications/${notId}`), {
                    usersNotified: usersNotified,
                });
            } else {
                batch.delete(db.doc(`/notifications/${notId}`));
            }
        });

        await batch.commit();

        return res.json({ message: 'notifications acknowledged!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
};

export default {
    getNotifications,
    acknowledgeNotification,
    acknowledgeNotifications,
};
