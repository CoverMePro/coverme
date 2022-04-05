import { Request, Response } from 'express';
import { ISickRequest } from '../models/Sick';
import { db } from '../utils/admin';

const createSickRequest = (req: Request, res: Response) => {
    const { name } = req.params;
    const sickRequest: ISickRequest = req.body;

    db.collection(`/companies/${name}/sick-requests`)
        .add(sickRequest)
        .then((result) => {
            sickRequest.id = result.id;
            return res.json(sickRequest);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getSickRequests = (req: Request, res: Response) => {
    const { name, user } = req.params;
    const sickRequests: ISickRequest[] = [];

    const shiftIds: string[] = [];

    console.log('IN');

    db.collection(`/companies/${name}/sick-requests`)
        .where('userId', '==', user)
        .get()
        .then(async (resultData) => {
            resultData.forEach((result) => {
                const sickRequest: ISickRequest = {
                    id: result.id,
                    ...result.data(),
                };

                sickRequests.push(sickRequest);
                shiftIds.push(sickRequest.shiftId!);
            });

            if (shiftIds.length > 0) {
                const shiftResults = await db
                    .collection(`/companies/${name}/shifts`)
                    .where('__name__', 'in', shiftIds)
                    .get();

                shiftResults.forEach((shift) => {
                    for (let i = 0, len = sickRequests.length; i < len; ++i) {
                        if (shift.id === sickRequests[i].shiftId) {
                            sickRequests[i].shift = {
                                id: shift.id,
                                ...shift.data(),
                            };
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
    const { name, id } = req.params;

    db.doc(`/companies/${name}/sick-requests/${id}`)
        .update({
            status: 'Approved',
        })
        .then(() => {
            // Call out time, either here or front end
            return res.json({ message: 'Sick request approved.' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const rejectSickRequest = (req: Request, res: Response) => {
    const { name, id } = req.params;

    db.doc(`/companies/${name}/sick-requests/${id}`)
        .update({
            status: 'Rejected',
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
    const { name, id } = req.params;

    db.doc(`/companies/${name}/sick-requests/${id}`)
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
    approveSickRequest,
    rejectSickRequest,
    deleteSickRequest,
};
