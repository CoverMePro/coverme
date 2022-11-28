import { Request, Response } from 'express';
import { INotification, NotificationType } from '../models/Notification';
import { mapToShift } from '../models/Shift';
import { ISickRequest, mapToSickRequest } from '../models/Sick';
import { ITeam, mapToTeams } from '../models/Team';
import { db } from '../utils/admin';

const createSickRequest = (req: Request, res: Response) => {
    const sickRequest: ISickRequest = req.body;
    sickRequest.requestDate = new Date(sickRequest.requestDate!);

    db.collection(`/sick-requests`)
        .where('shiftId', '==', sickRequest.shiftId)
        .get()
        .then(async (sickRequestDocs) => {
            if (!sickRequestDocs.empty) {
                return res
                    .status(403)
                    .json({ error: 'A sick request was already made with this shift' });
            }

            try {
                const sickRequestDoc = await db.collection(`/sick-requests`).add(sickRequest);

                sickRequest.id = sickRequestDoc.id;

                const shiftDoc = await db.doc(`/shifts/${sickRequest.shiftId}`).get();

                sickRequest.shift = mapToShift(shiftDoc.id, shiftDoc.data());

                const teamDoc = await db.doc(`/teams/${sickRequest.teamId}`).get();

                const team: ITeam = mapToTeams(teamDoc.id, teamDoc.data());

                const managers = team.managers;

                const notification: INotification = {
                    messageTitle: 'Sick Request Pending',
                    messageType: NotificationType.SICK,
                    messageBody: 'There has been a sick request made.',
                    usersNotified: managers,
                };

                await db.collection('/notifications').add(notification);

                return res.json({ sickRequest: sickRequest });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }
        });
};

const getSickRequests = (req: Request, res: Response) => {
    const { user } = req.params;
    const sickRequests: ISickRequest[] = [];

    const shiftIds: string[] = [];

    db.collection(`/sick-requests`)
        .where('userId', '==', user)
        .get()
        .then(async (sickRequestDocs) => {
            sickRequestDocs.forEach((sickRequestDoc) => {
                const sickRequest: ISickRequest = mapToSickRequest(
                    sickRequestDoc.id,
                    sickRequestDoc.data()
                );

                sickRequests.push(sickRequest);
                shiftIds.push(sickRequest.shiftId!);
            });

            if (shiftIds.length > 0) {
                const shiftDocs = await db
                    .collection(`/shifts`)
                    .where('__name__', 'in', shiftIds)
                    .get();

                shiftDocs.forEach((shiftDoc) => {
                    for (let i = 0, len = sickRequests.length; i < len; ++i) {
                        const sickRequest = sickRequests[i];

                        if (shiftDoc.id === sickRequest.shiftId) {
                            sickRequest.shift = mapToShift(shiftDoc.id, shiftDoc.data());
                        }
                    }
                });
            }

            return res.json({ sickRequests: sickRequests });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getSickRequestsFromTeams = (req: Request, res: Response) => {
    const teams = req.body.teams;

    let users: string[] = [];
    const sickRequests: ISickRequest[] = [];

    const shiftIds: string[] = [];

    db.collection(`/teams`)
        .where('__name__', 'in', teams)
        .get()
        .then((teamResult) => {
            teamResult.forEach((team) => {
                const teamData = team.data();

                if (teamData.staff) {
                    users = [...users, ...teamData.staff];
                }
            });

            return db
                .collection(`/sick-requests`)
                .where('userId', 'in', users)
                .where('status', '==', 'Pending')
                .get();
        })
        .then(async (sickRequestDocs) => {
            sickRequestDocs.forEach((sickRequestDoc) => {
                const sickRequest: ISickRequest = mapToSickRequest(
                    sickRequestDoc.id,
                    sickRequestDoc.data()
                );

                sickRequests.push(sickRequest);

                shiftIds.push(sickRequest.shiftId!);
            });

            if (shiftIds.length > 0) {
                const shiftDocs = await db
                    .collection(`/shifts`)
                    .where('__name__', 'in', shiftIds)
                    .get();

                shiftDocs.forEach((shiftDoc) => {
                    for (let i = 0, len = sickRequests.length; i < len; ++i) {
                        const sickRequest = sickRequests[i];
                        if (shiftDoc.id === sickRequest.shiftId) {
                            sickRequest.shift = mapToShift(shiftDoc.id, shiftDoc.data());
                        }
                    }
                });
            }

            return res.json({ sickRequests: sickRequests });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const approveSickRequest = (req: Request, res: Response) => {
    const { id } = req.params;

    let userId: string;

    db.doc(`/sick-requests/${id}`)
        .update({
            status: 'Approved',
        })
        .then(() => {
            return db.doc(`/sick-requests/${id}`).get();
        })
        .then((sickRequestDoc) => {
            const sickRequest = mapToSickRequest(sickRequestDoc.id, sickRequestDoc.data());

            userId = sickRequest.userId;

            return db.doc(`/shifts/${sickRequest.shiftId}`).update({
                userId: 'unclaimed',
            });
        })
        .then(() => {
            const notification: INotification = {
                messageTitle: 'Sick Request Approved',
                messageType: NotificationType.SICK,
                messageBody: 'Your sick request has been approved.',
                usersNotified: [userId],
            };

            return db.collection('/notifications').add(notification);
        })
        .then(() => {
            return res.json({ message: 'Sick request approved.' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const rejectSickRequest = (req: Request, res: Response) => {
    const { id, userId } = req.params;

    db.doc(`/sick-requests/${id}`)
        .update({
            status: 'Rejected',
        })
        .then(() => {
            const notification: INotification = {
                messageTitle: 'Sick Request Approved',
                messageType: NotificationType.SICK,
                messageBody: 'Your sick request has been approved.',
                usersNotified: [userId],
            };

            return db.collection('/notifications').add(notification);
        })
        .then(() => {
            return res.json({ message: 'Sick request rejected.' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const deleteSickRequest = (req: Request, res: Response) => {
    const { id } = req.params;

    db.doc(`/sick-requests/${id}`)
        .delete()
        .then(() => {
            return res.json({ message: 'Sick request deleted.' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    createSickRequest,
    getSickRequests,
    getSickRequestsFromTeams,
    approveSickRequest,
    rejectSickRequest,
    deleteSickRequest,
};
