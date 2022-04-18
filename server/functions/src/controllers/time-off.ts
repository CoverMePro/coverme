import { Request, Response } from 'express';
import { ITimeOffRequest } from '../models/TimeOff';
import { db } from '../utils/admin';

const createTimeOffRequest = (req: Request, res: Response) => {
    const timeOffRequest: ITimeOffRequest = req.body;

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

    db.collection(`/comapnies/${req.params.name}/time-off-requests`)
        .get()
        .then((resultData) => {
            resultData.forEach((result) => {
                timeOffRequests.push({
                    id: result.id,
                    ...result.data(),
                });
            });

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

    db.collection(`/comapnies/${name}/time-off-requests`)
        .where('userId', '==', user)
        .get()
        .then((resultData) => {
            resultData.forEach((result) => {
                timeOffRequests.push({
                    id: result.id,
                    ...result.data(),
                });
            });

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
    getUserTimeOffRequest,
    approveTimeOffRequest,
    rejectTimeOffRequest,
    deleteTimeOffRequest,
};
