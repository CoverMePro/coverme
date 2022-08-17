import { Request, Response } from 'express';
import { mapToShift } from '../models/Shift';
import { ISickRequest, mapToSickRequest } from '../models/Sick';
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

    db.doc(`/sick-requests/${id}`)
        .update({
            status: 'Approved',
        })
        .then(() => {
            // Call out time, either here or front end
            // remove shift from user
            // TO DO: Create callout from here
            return db.doc(`/sick-requests/${id}`).get();
        })
        .then((sickRequestDoc) => {
            const shiftId = sickRequestDoc.data()!.shiftId;
            return db.doc(`/shifts/${shiftId}`).update({
                userId: 'unclaimed',
            });
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
    const { id } = req.params;

    db.doc(`/sick-requests/${id}`)
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
