import { Request, Response } from 'express';
import { INotification, NotificationType, ISickRequest, IShift } from 'coverme-shared';
import dbHandler from '../db/db-handler';

const createSickRequest = async (req: Request, res: Response) => {
    const sickRequest: ISickRequest = req.body;
    sickRequest.requestDate = new Date(sickRequest.requestDate!);

    try {
        const sickRequestExist = await dbHandler.documentExistsByCondition(
            'sick-requests',
            'shiftId',
            '==',
            sickRequest.shiftId
        );

        if (sickRequestExist) {
            return res
                .status(403)
                .json({ error: 'A sick request was already made with this shift' });
        }

        const sickRequestAdded = await dbHandler.addDocument<ISickRequest>(
            'sick-requests',
            sickRequest
        );

        const shift = await dbHandler.getDocumentById<IShift>('shifts', sickRequest.shiftId);

        sickRequestAdded.shift = shift;

        return res.json(sickRequestAdded);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const getSickRequests = async (req: Request, res: Response) => {
    const { user } = req.params;
    try {
        const sickRequests = await dbHandler.getCollectionWithCondition<ISickRequest>(
            'sick-requests',
            'userId',
            '==',
            user
        );

        const shiftIds: string[] = [];

        sickRequests.forEach((sickRequest) => {
            shiftIds.push(sickRequest.shiftId);
        });

        if (shiftIds.length > 0) {
            const shifts = await dbHandler.getCollectionWithCondition<IShift>(
                'shifts',
                '__name__',
                'in',
                shiftIds
            );

            shifts.forEach((shift) => {
                for (let i = 0, len = sickRequests.length; i < len; ++i) {
                    const sickRequest = sickRequests[i];

                    if (shift.id === sickRequest.shiftId) {
                        sickRequest.shift = {
                            ...dbHandler.getData(shift),
                        };
                    }
                }
            });
        }

        return res.json(sickRequests);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const getSickRequestsFromTeams = async (req: Request, res: Response) => {
    const teams = req.body.teams;

    let users: string[] = [];

    const shiftIds: string[] = [];

    try {
        const retreivedTeams = await dbHandler.getCollectionWithCondition(
            'teams',
            '__name__',
            'in',
            teams
        );

        retreivedTeams.forEach((team) => {
            const teamData = dbHandler.getData(team);

            if (teamData.staff) {
                users = [...users, ...teamData.staff];
            }
        });

        const sickRequests = await dbHandler.getCollectionChainedConditions<ISickRequest>(
            'sick-requests',
            [
                {
                    property: 'userId',
                    operator: 'in',
                    value: users,
                },
                {
                    property: 'stauts',
                    operator: '==',
                    value: 'Pending',
                },
            ]
        );

        sickRequests.forEach((sickRequest) => {
            shiftIds.push(sickRequest.shiftId!);
        });

        if (shiftIds.length > 0) {
            const shifts = await dbHandler.getCollectionWithCondition<IShift>(
                'shifts',
                '__name__',
                'in',
                shiftIds
            );

            shifts.forEach((shift) => {
                for (let i = 0, len = sickRequests.length; i < len; ++i) {
                    const sickRequest = sickRequests[i];

                    if (shift.id === sickRequest.shiftId) {
                        sickRequest.shift = {
                            ...dbHandler.getData(shift),
                        };
                    }
                }
            });
        }

        return res.json(sickRequests);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const approveSickRequest = async (req: Request, res: Response) => {
    const { id } = req.params;

    let userId: string;

    try {
        await dbHandler.updateDocument<ISickRequest>('sick-requests', id, {
            status: 'Approved',
        });

        const sickRequest = await dbHandler.getDocumentById<ISickRequest>('sick-requests', id);

        userId = sickRequest.userId;

        await dbHandler.updateDocument<IShift>('shifts', sickRequest.shiftId, {
            userId: 'unclaimed',
        });

        const notification: INotification = {
            messageTitle: 'Sick Request Approved',
            messageType: NotificationType.SICK,
            messageBody: 'Your sick request has been approved.',
            usersNotified: [userId],
        };

        await dbHandler.addDocument<INotification>('notifications', notification);

        return res.json({ message: 'Sick request approved.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const rejectSickRequest = async (req: Request, res: Response) => {
    const { id, userId } = req.params;

    try {
        await dbHandler.updateDocument<ISickRequest>('sick-requests', id, {
            status: 'Declined',
        });

        const notification: INotification = {
            messageTitle: 'Sick Request Approved',
            messageType: NotificationType.SICK,
            messageBody: 'Your sick request has been approved.',
            usersNotified: [userId],
        };

        await dbHandler.addDocument<INotification>('notifications', notification);

        return res.json({ message: 'Sick request rejected.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const deleteSickRequest = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await dbHandler.deleteDocument('sick-requests', id);
        return res.json({ message: 'Sick request deleted.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

export default {
    createSickRequest,
    getSickRequests,
    getSickRequestsFromTeams,
    approveSickRequest,
    rejectSickRequest,
    deleteSickRequest,
};
