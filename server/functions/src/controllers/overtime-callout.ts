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

const acceptCalloutShift = async (req: Request, res: Response) => {
    const {id, email} = req.params;
    db.doc(`/overtime-callouts/${id}`).get()
    .then(async (overtimeCalloutResult) => {
        const overtimeCallout: IOvertime = {
            id: overtimeCalloutResult.id,
            ...overtimeCalloutResult.data(),
            dateCreated: overtimeCalloutResult.data()!.dateCreated.toDate()
        };

        const calloutList = [...overtimeCallout.callouts!];

        const userInListIdx = calloutList.findIndex(user => user.user === email);

        if (userInListIdx != -1) {
            calloutList[userInListIdx].status = 'Accepted';

            try {
                await db.doc(`/companies/${overtimeCallout.company!}/shifts/${overtimeCallout.shiftId}`).update({
                    userId: email
                });

                await   db.doc(`/overtime-callouts/${id}`).update({
                    callouts: calloutList,
                    status: "Completed"
                })

                return res.json({message: 'shift has been accepted'});
            } catch(err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }
        }  

        return res.status(500).json({ error: 'No user found in callout request' });

    });
}

const rejectedCalloutShift = (req: Request, res: Response) => {
    const {id, email} = req.params;
    db.doc(`/overtime-callouts/${id}`).get()
    .then(async (overtimeCalloutResult) => {
        const overtimeCallout: IOvertime = {
            id: overtimeCalloutResult.id,
            ...overtimeCalloutResult.data(),
            dateCreated: overtimeCalloutResult.data()!.dateCreated.toDate()
        };

        const calloutList = [...overtimeCallout.callouts!];

        const userInListIdx = calloutList.findIndex(user => user.user === email);

        if (userInListIdx != -1) {
            calloutList[userInListIdx].status = 'Rejected';

            try {
                await   db.doc(`/overtime-callouts/${id}`).update({
                    callouts: calloutList,
                })

                return res.json({message: 'shift has been accepted'});
            } catch(err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }
        }  

        return res.status(500).json({ error: 'No user found in callout request' });

    });

}

export default {
    createOvertimeCallout,
    getPendingOvertimeCallouts,
    acceptCalloutShift,
    rejectedCalloutShift
};
