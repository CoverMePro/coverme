import { Request, Response } from 'express';
import { IShiftTransaction } from '../models/ShiftTransaction';
import { IUser } from '../models/User';
import { db } from '../utils/admin';

const getStaffandShiftsFromTeams = (req: Request, res: Response) => {
    const teams: string[] = req.body.teams;
    const teamStaff: any = [];
    const shifts: any = [];
    db.collection('users')
        .where('teams', 'array-contains-any', teams)
        .get()
        .then((staffData) => {
            const staffList: IUser[] = [];

            staffData.forEach((user) => {
                if (user.data().role !== 'owner') {
                    staffList.push({ email: user.id, ...user.data() });
                }
            });

            teams.forEach((team) => {
                const staffInTeam = staffList.filter(
                    (staff) => staff.teams?.findIndex((t) => t === team) !== -1
                );
                staffInTeam.forEach((staff) => {
                    teamStaff.push({
                        id: staff.email,
                        team: team,
                        title: `${staff.firstName} ${staff.lastName}`,
                    });
                });
            });

            return db.collection('shifts').where('teamId', 'in', teams).get();
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

    const transactions: IShiftTransaction[] = req.body.transactions;

    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];

        console.log(transaction);

        switch (transaction.type) {
            case 'add':
                batch.create(db.collection('/shifts').doc(), {
                    name: transaction.name,
                    userId: transaction.userId,
                    companyId: transaction.companyId,
                    teamId: transaction.teamId,
                    startDateTime: transaction.startDate,
                    endDateTime: transaction.endDate,
                });
                break;
            case 'remove':
                break;
            case 'change':
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
    getStaffandShiftsFromTeams,
    transactionShifts,
};
