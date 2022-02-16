import { Request, Response } from 'express';
import { IScheduleStaff } from '../models/ScheduleInfo';
import { IShift, IShiftDefinition } from '../models/Shift';
import { IShiftTransaction } from '../models/ShiftTransaction';
import { db } from '../utils/admin';

const getShiftsAndStaff = (req: Request, res: Response) => {
    const company = req.params.name;

    const teamStaff: IScheduleStaff[] = [];
    const shifts: IShift[] = [];

    db.collection('users')
        .where('company', '==', company)
        .get()
        .then((staffData) => {
            staffData.forEach((user) => {
                const userData = user.data();
                if (userData.teams && userData.role !== 'owner' && userData.role !== 'manager') {
                    for (let i = 0, len = userData.teams.length; i < len; i++) {
                        const team = userData.teams[i];
                        teamStaff.push({
                            id: `${team}-${user.id}`,
                            team: team,
                            email: user.id,
                            title: `${userData.firstName} ${userData.lastName}`,
                        });
                    }
                }
            });

            return db.collection(`/companies/${company}/shifts`).get();
        })
        .then((shiftData) => {
            shiftData.forEach((shift) => {
                shifts.push({ ...shift.data(), id: shift.id });
            });

            return res.json({ teamStaff: teamStaff, shifts: shifts });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const transactionShifts = (req: Request, res: Response) => {
    const batch = db.batch();

    const { name } = req.params;
    const transactions: IShiftTransaction[] = req.body.transactions;

    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        console.log(transaction);
        switch (transaction.type) {
            case 'add':
                batch.create(db.collection(`companies/${name}/shifts`).doc(), {
                    name: transaction.name,
                    userId: transaction.userId,
                    teamId: transaction.teamId,
                    startDateTime: transaction.startDate,
                    endDateTime: transaction.endDate,
                });
                break;
            case 'remove':
                batch.delete(db.doc(`companies/${name}/shifts/${transaction.id}`));
                break;
            case 'change':
                batch.update(db.doc(`companies/${name}/shifts/${transaction.id}`), {
                    userId: transaction.userId,
                    teamId: transaction.teamId,
                    startDateTime: transaction.startDate,
                    endDateTime: transaction.endDate,
                });
                break;
        }
    }

    batch
        .commit()
        .then(() => {
            return res.json({ message: 'transactions completed!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const createShiftDefinition = (req: Request, res: Response) => {
    const shiftDef: IShiftDefinition = req.body.shiftDef;
    const company = req.params.name;

    db.collection(`/companies/${company}/shift-definitions`)
        .add(shiftDef)
        .then((result) => {
            console.log(result);
            res.json({ message: 'Shift definition created!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const deleteShiftDefinition = (req: Request, res: Response) => {
    const company = req.params.name;
    const shiftDefId = req.params.id;
    db.doc(`/companies/${company}/shift-definition/${shiftDefId}`)
        .delete()
        .then((result) => {
            console.log(result);
            res.json({ message: 'Shift definition deleted!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    getShiftsAndStaff,
    transactionShifts,
    createShiftDefinition,
    deleteShiftDefinition,
};
