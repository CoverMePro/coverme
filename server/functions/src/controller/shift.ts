import { Request, Response } from 'express';
import { IScheduleStaff } from '../models/ScheduleInfo';
import { IShift } from '../models/Shift';
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
                    userData.teams.foreach((team: string) => {
                        teamStaff.push({
                            id: `${team}-${user.id}`,
                            team: team,
                            email: user.id,
                            title: `${userData.firstName} ${userData.lastName}`,
                        });
                    });
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
                batch.delete(db.doc(`/shifts/${transaction.id}`));
                break;
            case 'change':
                batch.update(db.doc(`/shifts/${transaction.id}`), {
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

export default {
    getShiftsAndStaff,
    transactionShifts,
};
