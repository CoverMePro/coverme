import { Request, Response } from 'express';
import { ITimeOffRequest, mapToTimeOffRequest } from '../models/TimeOff';
import { db } from '../utils/admin';
import { formatFirestoreData } from '../utils/db-helpers';

const createTimeOffRequest = (req: Request, res: Response) => {
    const timeOffRequest: ITimeOffRequest = req.body;

    timeOffRequest.requestDate = new Date(timeOffRequest.requestDate!);
    timeOffRequest.timeOffStart = new Date(timeOffRequest.timeOffStart!);
    timeOffRequest.timeOffEnd = new Date(timeOffRequest.timeOffEnd!);

    db.collection(`/time-off-requests`)
        .add(timeOffRequest)
        .then((result) => {
            timeOffRequest.id = result.id;
            return res.json({ timeOffRequest: timeOffRequest });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getAllTimeOffRequest = (req: Request, res: Response) => {
    db.collection(`/time-off-requests`)
        .get()
        .then((timeoffRequestDocs) => {
            const timeOffRequests = formatFirestoreData(timeoffRequestDocs, mapToTimeOffRequest);

            return res.json({ timeOffRequests: timeOffRequests });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getTimeOffFromTeams = (req: Request, res: Response) => {
    const teams = req.body.teams;

    let users: string[] = [];

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

            console.error(users);

            return db
                .collection(`/time-off-requests`)
                .where('userId', 'in', users)
                .where('status', '==', 'Pending')
                .get();
        })
        .then((timeoffRequestDocs) => {
            const timeOffRequests = formatFirestoreData(timeoffRequestDocs, mapToTimeOffRequest);

            return res.json({ timeOffRequests: timeOffRequests });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getUserTimeOffRequest = (req: Request, res: Response) => {
    const { user } = req.params;

    db.collection(`/time-off-requests`)
        .where('userId', '==', user)
        .get()
        .then((timeoffRequestDocs) => {
            const timeOffRequests = formatFirestoreData(timeoffRequestDocs, mapToTimeOffRequest);

            return res.json({ timeOffRequests: timeOffRequests });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const approveTimeOffRequest = (req: Request, res: Response) => {
    const { id } = req.params;

    db.doc(`/time-off-requests/${id}`)
        .update({
            status: 'Approved',
        })
        .then(() => {
            return db.doc(`/time-off-requests/${id}`).get();
        })
        .then((timeOffRequestResult) => {
            const timeOffData = timeOffRequestResult.data()!;

            return db.collection(`/time-off`).add({
                name: timeOffData.type,
                startDateTime: timeOffData.timeOffStart,
                endDateTime: timeOffData.timeOffEnd,
                userId: timeOffData.userId,
                userName: timeOffData.userName,
                teams: timeOffData.teams,
            });
        })
        .then(() => {
            return res.json({ message: 'time off request approved.' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const rejectTimeOffRequest = (req: Request, res: Response) => {
    const { id } = req.params;

    db.doc(`/time-off-requests/${id}`)
        .update({
            status: 'Rejected',
        })
        .then(() => {
            return res.json({ message: 'time off request rejected.' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const deleteTimeOffRequest = (req: Request, res: Response) => {
    const { id } = req.params;

    db.doc(`/time-off/${id}`)
        .delete()
        .then(() => {
            return res.json({ message: 'Time off request deleted.' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    createTimeOffRequest,
    getAllTimeOffRequest,
    getTimeOffFromTeams,
    getUserTimeOffRequest,
    approveTimeOffRequest,
    rejectTimeOffRequest,
    deleteTimeOffRequest,
};
