import { Request, Response } from 'express';
import { IScheduleStaff } from '../models/ScheduleInfo';
import { IShift, IShiftDefinition } from '../models/Shift';
import { IShiftTransaction } from '../models/ShiftTransaction';
import { ITimeOff } from '../models/TimeOff';
import { db } from '../utils/admin';

const getShiftsAndStaff = (req: Request, res: Response) => {
    const company = req.params.name;

    const teamStaff: IScheduleStaff[] = [];
    const shifts: IShift[] = [];
    const timeOff: ITimeOff[] = [];
    const shiftDefs: IShiftDefinition[] = [];

    const teams: string[] = [];

    db.collection('users')
        .where('company', '==', company)
        .get()
        .then((staffData) => {
            staffData.forEach((user) => {
                const userData = user.data();
                if (userData.teams && userData.role !== 'owner' && userData.role !== 'manager') {
                    for (let i = 0, len = userData.teams.length; i < len; i++) {
                        const team = userData.teams[i];

                        if (teams.findIndex((t) => t === team) === -1) {
                            teams.push(team);
                            teamStaff.push({
                                id: `${team}-unclaimed`,
                                team: team,
                                email: '',
                                title: `Unclaimed Shifts`,
                            });
                        }

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
                console.log(shift.data().startDateTime);
                shifts.push({
                    ...shift.data(),
                    id: shift.id,
                    startDateTime: shift.data().startDateTime.toDate(),
                    endDateTime: shift.data().endDateTime.toDate(),
                });
            });

            return db.collection(`/companies/${company}/time-off`).get();
        })
        .then((timeOffResult) => {
            timeOffResult.forEach((timeOffData) => {
                console.log(timeOffData.data().startDateTime);
                timeOff.push({
                    ...timeOffData.data(),
                    id: timeOffData.id,
                    startDateTime: timeOffData.data().startDateTime.toDate(),
                    endDateTime: timeOffData.data().endDateTime.toDate(),
                });
            });

            return db.collection(`/companies/${company}/shift-definitions`).get();
        })
        .then((shiftDefData) => {
            shiftDefData.forEach((shiftDef) => {
                shiftDefs.push({
                    id: shiftDef.id,
                    name: shiftDef.data().name,
                    duration: shiftDef.data().duration,
                });
            });
            return res.json({
                teamStaff: teamStaff,
                shifts: shifts,
                timeOff: timeOff,
                shiftDefs: shiftDefs,
            });
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
                    startDateTime: new Date(transaction.startDate),
                    endDateTime: new Date(transaction.endDate),
                });
                break;
            case 'remove':
                batch.delete(db.doc(`companies/${name}/shifts/${transaction.id}`));
                break;
            case 'change':
                batch.update(db.doc(`companies/${name}/shifts/${transaction.id}`), {
                    userId: transaction.userId,
                    teamId: transaction.teamId,
                    startDateTime: new Date(transaction.startDate),
                    endDateTime: new Date(transaction.endDate),
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
    const shiftDef: IShiftDefinition = req.body;
    const company = req.params.name;

    db.collection(`/companies/${company}/shift-definitions`)
        .add(shiftDef)
        .then((result) => {
            return result.get();
        })
        .then((resultdata) => {
            const shiftDef: IShiftDefinition = {
                id: resultdata.id,
                name: resultdata.data()!.name,
                duration: resultdata.data()!.duration,
            };
            return res.json({ message: 'Shift definition created!', shiftDef: shiftDef });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const deleteShiftDefinition = (req: Request, res: Response) => {
    const company = req.params.name;
    const shiftDefId = req.params.id;
    db.doc(`/companies/${company}/shift-definitions/${shiftDefId}`)
        .delete()
        .then((result) => {
            console.log(result);
            return res.json({ message: 'Shift definition deleted!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getShiftDefinitions = (req: Request, res: Response) => {
    const company = req.params.name;
    db.collection(`/companies/${company}/shift-definitions`)
        .get()
        .then((shiftDefData) => {
            const shiftDefs: IShiftDefinition[] = [];
            shiftDefData.forEach((shiftDef) => {
                shiftDefs.push({
                    id: shiftDef.id,
                    name: shiftDef.data().name,
                    duration: shiftDef.data().duration,
                });
            });

            return res.json({ shiftDefs });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getShiftForUser = (req: Request, res: Response) => {
    const { name, user } = req.params;
    db.collection(`/companies/${name}/shifts`)
        .where('userId', '==', user)
        .get()
        .then((shiftData) => {
            const shifts: IShift[] = [];
            shiftData.forEach((shift) => {
                shifts.push({
                    id: shift.id,
                    ...shift.data(),
                    startDateTime: shift.data().startDateTime.toDate(),
                    endDateTime: shift.data().endDateTime.toDate(),
                });
            });

            return res.json({ shifts });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getShiftsFromTodayOnward = (req: Request, res: Response) => {
    const { name, user } = req.params;

    db.collection(`/companies/${name}/shifts`)
        .where('userId', '==', user)
        .where('startDateTime', '>', new Date())
        .get()
        .then((shiftData) => {
            const shifts: IShift[] = [];
            shiftData.forEach((shift) => {
                shifts.push({
                    id: shift.id,
                    ...shift.data(),
                    startDateTime: shift.data().startDateTime.toDate(),
                    endDateTime: shift.data().endDateTime.toDate(),
                });
            });

            return res.json({ shifts });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getShiftsFromDateRange = (req: Request, res: Response) => {
    const { name, user } = req.params;

    const { startRange, endRange } = req.body;

    console.log(startRange);
    console.log(endRange);

    db.collection(`/companies/${name}/shifts`)
        .where('userId', '==', user)
        .where('startDateTime', '>', new Date(startRange))
        .where('startDateTime', '<', new Date(endRange))
        .get()
        .then((shiftData) => {
            const shifts: IShift[] = [];
            shiftData.forEach((shift) => {
                shifts.push({
                    id: shift.id,
                    ...shift.data(),
                    startDateTime: shift.data().startDateTime.toDate(),
                    endDateTime: shift.data().endDateTime.toDate(),
                });
            });

            return res.json({ shifts });
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
    getShiftDefinitions,
    getShiftForUser,
    getShiftsFromTodayOnward,
    getShiftsFromDateRange,
};
