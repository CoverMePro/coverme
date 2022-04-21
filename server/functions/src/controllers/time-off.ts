import { Request, Response } from 'express';
import { ITimeOffRequest } from '../models/TimeOff';
import { db } from '../utils/admin';

const createTimeOffRequest = (req: Request, res: Response) => {
    const timeOffRequest: ITimeOffRequest = req.body;

    console.log(req.params);

    timeOffRequest.requestDate = new Date(timeOffRequest.requestDate!);
    timeOffRequest.timeOffStart = new Date(timeOffRequest.timeOffStart!);
    timeOffRequest.timeOffEnd = new Date(timeOffRequest.timeOffEnd!);

    db.collection(`/companies/${req.params.name}/time-off-requests`)
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
    const timeOffRequests: ITimeOffRequest[] = [];

    db.collection(`/companies/${req.params.name}/time-off-requests`)
        .get()
        .then((resultData) => {
            resultData.forEach((result) => {
                timeOffRequests.push({
                    id: result.id,
                    ...result.data(),
                    requestDate: result.data().requestDate.toDate(),
                    timeOffStart: result.data().timeOffStart.toDate(),
                    timeOffEnd: result.data().timeOffEnd.toDate(),
                });
            });

            return res.json({ timeOffRequests: timeOffRequests });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getTimeOffFromTeams = (req: Request, res: Response) => {
    console.log('FROM TEAMS');
    const teams = req.body.teams;

    let users: string[] = [];
    const timeOffRequests: ITimeOffRequest[] = [];

    db.collection(`/companies/${req.params.name}/teams`)
        .where('__name__', 'in', teams)
        .get()
        .then((teamResult) => {
            teamResult.forEach((team) => {
                const teamData = team.data();

                if (teamData.staff) {
                    users = [...users, ...teamData.staff];
                }
            });

            console.log(users);

            return db
                .collection(`/companies/${req.params.name}/time-off-requests`)
                .where('userId', 'in', users)
                .where('status', '==', 'Pending')
                .get();
        })
        .then((resultData) => {
            resultData.forEach((result) => {
                timeOffRequests.push({
                    id: result.id,
                    ...result.data(),
                    requestDate: result.data().requestDate.toDate(),
                    timeOffStart: result.data().timeOffStart.toDate(),
                    timeOffEnd: result.data().timeOffEnd.toDate(),
                });
            });

            console.log(timeOffRequests);

            return res.json({ timeOffRequests: timeOffRequests });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getUserTimeOffRequest = (req: Request, res: Response) => {
    const { name, user } = req.params;

    const timeOffRequests: ITimeOffRequest[] = [];

    db.collection(`/companies/${name}/time-off-requests`)
        .where('userId', '==', user)
        .get()
        .then((resultData) => {
            resultData.forEach((result) => {
                timeOffRequests.push({
                    id: result.id,
                    ...result.data(),
                    requestDate: result.data().requestDate.toDate(),
                    timeOffStart: result.data().timeOffStart.toDate(),
                    timeOffEnd: result.data().timeOffEnd.toDate(),
                });
            });

            console.log(timeOffRequests);

            return res.json({ timeOffRequests: timeOffRequests });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const approveTimeOffRequest = (req: Request, res: Response) => {
    const { name, id } = req.params;

    db.doc(`/companies/${name}/time-off-requests/${id}`)
        .update({
            status: 'Approved',
        })
        .then(() => {
            return db.doc(`/companies/${name}/time-off-requests/${id}`).get();
        })
        .then((timeOffRequestResult) => {
            const timeOffData = timeOffRequestResult.data()!;

            return db.collection(`/companies/${name}/time-off`).add({
                name: timeOffData.type,
                startDateTime: timeOffData.timeOffStart,
                endDateTime: timeOffData.timeOffEnd,
                userId: timeOffData.userId,
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
    const { name, id } = req.params;

    db.doc(`/companies/${name}/time-off-requests/${id}`)
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
    const { name, id } = req.params;

    db.doc(`/companies/${name}/time-off/${id}`)
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
