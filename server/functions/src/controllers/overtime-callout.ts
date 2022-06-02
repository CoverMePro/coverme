import { Request, Response } from 'express';
import { IOvertime } from '../models/Overtime';
import { db } from '../utils/admin';

const createOvertimeCallout = (req: Request, res: Response) => {
    const overtimeCallout: IOvertime = req.body;

    db.collection('/overtime-callouts')
        .add({ ...overtimeCallout, dateCreated: new Date() })
        .then((result) => {
            overtimeCallout.id = result.id;
            return res.json({ overtimeCallout: overtimeCallout });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getPendingOvertimeCallouts = (req: Request, res: Response) => {
    const company = req.params.company;

    const overtimeCallouts: IOvertime[] = [];

    db.collection('/overtime-callouts')
        .where('company', '==', company)
        .where('status', '==', 'Pending')
        .orderBy('dateCreated')
        .get()
        .then((resultData) => {
            resultData.forEach((result) => {
                overtimeCallouts.push({
                    id: result.id,
                    ...result.data(),
                    dateCreated: result.data().dateCreated.toDate(),
                });
            });

            return res.json({ overtimeCallouts: overtimeCallouts });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    createOvertimeCallout,
    getPendingOvertimeCallouts,
};
