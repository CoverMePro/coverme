import { Request, Response } from 'express';
import { IOvertime, mapToOvertime } from '../models/Overtime';
import { db } from '../utils/admin';
import { formatFirestoreData } from '../utils/db-helpers';
import calloutCyle from '../utils/overtime';

const createOvertimeCallout = (req: Request, res: Response) => {
    const overtimeCallout: IOvertime = req.body;

    db.collection('/overtyime-callouts')
        .where('shiftId', '==', overtimeCallout.shiftId)
        .get()
        .then(async (overtimeDocs) => {
            if (!overtimeDocs.empty) {
                return res
                    .status(403)
                    .json({ error: 'A Callout already has been made on this shift' });
            }
            try {
                const overtimeCalloutDoc = await db
                    .collection('/overtime-callouts')
                    .add({ ...overtimeCallout, dateCreated: new Date() });

                overtimeCallout.id = overtimeCalloutDoc.id;
                return res.json({ overtimeCallout: overtimeCallout });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }
        });
};

const getOvertimeCallouts = (req: Request, res: Response) => {
    const company = req.params.company;

    db.collection('/overtime-callouts')
        .where('company', '==', company)
        .orderBy('dateCreated')
        .get()
        .then((overtimeCalloutDocs) => {
            const overtimeCallouts: IOvertime[] = formatFirestoreData(
                overtimeCalloutDocs,
                mapToOvertime
            );

            return res.json({ overtimeCallouts: overtimeCallouts });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const acceptCalloutShift = async (req: Request, res: Response) => {
    const { id } = req.params;
    const email = req.body.email;
    db.doc(`/overtime-callouts/${id}`)
        .get()
        .then(async (overtimeCalloutDoc) => {
            const overtimeCallout: IOvertime = mapToOvertime(
                overtimeCalloutDoc.id,
                overtimeCalloutDoc.data()
            );
            const calloutList = [...overtimeCallout.callouts!];

            const userInListIdx = calloutList.findIndex((user) => user.user === email);

            if (userInListIdx != -1) {
                calloutList[userInListIdx].status = 'Accepted';

                try {
                    await db.doc(`/overtime-callouts/${id}`).update({
                        callouts: calloutList,
                    });

                    return res.json({ message: 'shift has been accepted' });
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ error: err });
                }
            }

            return res.status(500).json({ error: 'No user found in callout request' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const rejectedCalloutShift = (req: Request, res: Response) => {
    const { id } = req.params;
    const email = req.body.email;
    db.doc(`/overtime-callouts/${id}`)
        .get()
        .then(async (overtimeCalloutDoc) => {
            const overtimeCallout: IOvertime = mapToOvertime(
                overtimeCalloutDoc.id,
                overtimeCalloutDoc.data()
            );

            const calloutList = [...overtimeCallout.callouts!];

            const userInListIdx = calloutList.findIndex((user) => user.user === email);

            if (userInListIdx != -1) {
                calloutList[userInListIdx].status = 'Rejected';

                try {
                    await db.doc(`/overtime-callouts/${id}`).update({
                        callouts: calloutList,
                    });

                    return res.json({ message: 'shift has been rejected' });
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ error: err });
                }
            }

            return res.status(500).json({ error: 'No user found in callout request' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err });
        });
};

const testCycleCallout = (_: Request, res: Response) => {
    calloutCyle()
        .then(() => {
            return res.json({ message: 'callout round complete' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err });
        });
};

export default {
    createOvertimeCallout,
    getOvertimeCallouts,
    acceptCalloutShift,
    rejectedCalloutShift,
    testCycleCallout,
};
