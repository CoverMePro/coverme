import { Request, Response } from 'express';
import { IScheduleStaff } from '../models/ScheduleInfo';
import { IShift, IShiftTemplate, mapToShift, mapToShiftDefinition } from '../models/Shift';
import {
    IShiftRotation,
    IShiftRotationTransaction,
    mapToShiftRotation,
} from '../models/ShiftRotation';
import { IShiftTransaction } from '../models/ShiftTransaction';
import { ITeam, mapToTeams } from '../models/Team';
import { ITimeOff, mapToTimeOff } from '../models/TimeOff';
import { db } from '../utils/admin';
import { formatFirestoreData } from '../utils/db-helpers';

const getShiftsAndStaffFromCompany = (req: Request, res: Response) => {
    const staff: IScheduleStaff[] = [];
    let shifts: IShift[] = [];
    let teams: ITeam[] = [];
    let timeOff: ITimeOff[] = [];
    let shiftDefs: IShiftTemplate[] = [];
    let shiftRotations: IShiftRotation[] = [];

    //const teams: string[] = [];

    db.collection('users')
        .get()
        .then((staffData) => {
            staffData.forEach((user) => {
                const userData = user.data();
                staff.push({
                    id: 'unclaimed',
                    teams: [],
                    userId: 'unclaimed',
                    userName: 'unassigned',
                    title: 'unassigned',
                    employeeType: 'unassigned',
                });
                if (userData.role === 'staff') {
                    staff.push({
                        id: user.id,
                        teams: userData.teams ? userData.teams : [],
                        userId: user.id,
                        userName: `${userData.firstName} ${userData.lastName}`,
                        title: `${userData.firstName} ${userData.lastName}`,
                        employeeType: userData.employeeType,
                    });
                }
            });

            return db.collection(`/teams`).get();
        })
        .then((teamsDoc) => {
            teams = formatFirestoreData(teamsDoc, mapToTeams);

            return db.collection(`/shifts`).get();
        })
        .then((shiftDocs) => {
            shifts = formatFirestoreData(shiftDocs, mapToShift);

            return db.collection(`/time-off`).get();
        })
        .then((timeOffDocs) => {
            timeOff = formatFirestoreData(timeOffDocs, mapToTimeOff);

            return db.collection(`/shift-templates`).get();
        })
        .then((shiftDefinitionDocs) => {
            shiftDefs = formatFirestoreData(shiftDefinitionDocs, mapToShiftDefinition);

            return db.collection('/shift-rotations').get();
        })
        .then((shiftRotationDocs) => {
            shiftRotations = formatFirestoreData(shiftRotationDocs, mapToShiftRotation);

            return res.json({
                staff: staff,
                shifts: shifts,
                teams: teams,
                timeOff: timeOff,
                shiftDefs: shiftDefs,
                rotations: shiftRotations,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getEndDate = (startDate: Date, duration: string) => {
    const durHrs = duration?.substring(0, 2);
    const durMin = duration?.substring(3);

    const hours = parseInt(durHrs!, 10);
    const mins = parseInt(durMin!, 10);

    const endDate = new Date(startDate);

    endDate.setTime(endDate.getTime() + hours * 60 * 60 * 1000 + mins * 60 * 1000);

    return endDate;
};

/**
 *  Organize and carry out specific db request based on transactions (add, change, remove)
 */
const transactionShifts = (req: Request, res: Response) => {
    const batch = db.batch();

    const transactions: IShiftTransaction[] = req.body.transactions;
    const rotationTransactions: IShiftRotationTransaction[] = req.body.rotationTransactions;

    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        switch (transaction.type) {
            case 'add':
                batch.create(db.collection(`/shifts`).doc(), {
                    name: transaction.name,
                    userId: transaction.userId === '' ? 'unclaimed' : transaction.userId,
                    userName: transaction.userName === '' ? 'unclaimed' : transaction.userName,
                    teamId: transaction.teamId,
                    startDateTime: new Date(transaction.startDate),
                    endDateTime: new Date(transaction.endDate),
                });
                break;
            case 'remove':
                batch.delete(db.doc(`/shifts/${transaction.id}`));
                break;
            case 'change':
                batch.update(db.doc(`/shifts/${transaction.id}`), {
                    userId: transaction.userId,
                    teamId: transaction.teamId,
                    userName: transaction.userName,
                    startDateTime: new Date(transaction.startDate),
                    endDateTime: new Date(transaction.endDate),
                });
                break;
        }
    }

    for (let i = 0; i < rotationTransactions.length; i++) {
        const rotTransaction = rotationTransactions[i];

        const end = new Date(rotTransaction.endDate);
        const rotation = rotTransaction.rotation;

        for (let d = new Date(rotTransaction.startDate); d <= end; d.setDate(d.getDate() + 1)) {
            let shiftStartDate: Date = new Date(d);
            let shiftEndDate: Date = new Date(d);

            let shiftName: String = 'test';

            let foundShift = false;

            switch (d.getDay()) {
                case 0:
                    if (rotation.shifts.sunday) {
                        shiftStartDate = new Date(d);
                        shiftStartDate.setHours(
                            rotation.shifts.sunday.timeHour,
                            rotation.shifts.sunday.timeMinute
                        );

                        shiftEndDate = getEndDate(shiftStartDate, rotation.shifts.sunday.duration);
                        shiftName = rotation.shifts.sunday.name;
                        foundShift = true;
                    }
                    break;
                case 1:
                    if (rotation.shifts.monday) {
                        shiftStartDate = new Date(d);
                        shiftStartDate.setHours(
                            rotation.shifts.monday.timeHour,
                            rotation.shifts.monday.timeMinute
                        );

                        shiftEndDate = getEndDate(shiftStartDate, rotation.shifts.monday.duration);
                        shiftName = rotation.shifts.monday.name;
                        foundShift = true;
                    }
                    break;
                case 2:
                    if (rotation.shifts.tuesday) {
                        shiftStartDate = new Date(d);
                        shiftStartDate.setHours(
                            rotation.shifts.tuesday.timeHour,
                            rotation.shifts.tuesday.timeMinute
                        );

                        shiftEndDate = getEndDate(shiftStartDate, rotation.shifts.tuesday.duration);
                        shiftName = rotation.shifts.tuesday.name;
                        foundShift = true;
                    }
                    break;
                case 3:
                    if (rotation.shifts.wednesday) {
                        shiftStartDate = new Date(d);
                        shiftStartDate.setHours(
                            rotation.shifts.wednesday.timeHour,
                            rotation.shifts.wednesday.timeMinute
                        );

                        shiftEndDate = getEndDate(
                            shiftStartDate,
                            rotation.shifts.wednesday.duration
                        );
                        shiftName = rotation.shifts.wednesday.name;
                        foundShift = true;
                    }
                    break;
                case 4:
                    if (rotation.shifts.thursday) {
                        shiftStartDate = new Date(d);
                        shiftStartDate.setHours(
                            rotation.shifts.thursday.timeHour,
                            rotation.shifts.thursday.timeMinute
                        );

                        shiftEndDate = getEndDate(
                            shiftStartDate,
                            rotation.shifts.thursday.duration
                        );
                        shiftName = rotation.shifts.thursday.name;
                        foundShift = true;
                    }
                    break;
                case 5:
                    if (rotation.shifts.friday) {
                        shiftStartDate = new Date(d);
                        shiftStartDate.setHours(
                            rotation.shifts.friday.timeHour,
                            rotation.shifts.friday.timeMinute
                        );

                        shiftEndDate = getEndDate(shiftStartDate, rotation.shifts.friday.duration);
                        shiftName = rotation.shifts.friday.name;
                        foundShift = true;
                    }
                    break;
                case 6:
                    if (rotation.shifts.saturday) {
                        shiftStartDate = new Date(d);
                        shiftStartDate.setHours(
                            rotation.shifts.saturday.timeHour,
                            rotation.shifts.saturday.timeMinute
                        );

                        shiftEndDate = getEndDate(
                            shiftStartDate,
                            rotation.shifts.saturday.duration
                        );
                        shiftName = rotation.shifts.saturday.name;
                        foundShift = true;
                    }
                    break;
            }

            if (foundShift) {
                batch.create(db.collection(`/shifts`).doc(), {
                    name: shiftName,
                    userId: rotTransaction.userId,
                    userName: rotTransaction.userName,
                    teamId: rotTransaction.teamId,
                    startDateTime: shiftStartDate,
                    endDateTime: shiftEndDate,
                });
            }
        }
    }

    batch
        .commit()
        .then(() => {
            return res.json({ message: 'transactions completed!' });
        })
        .catch((err) => {
            return res.status(500).json({ error: err.code });
        });
};

const createShiftTemplate = (req: Request, res: Response) => {
    const shiftTemplateToAdd: IShiftTemplate = req.body;
    db.collection(`/shift-templates`)
        .add(shiftTemplateToAdd)
        .then((result) => {
            return result.get();
        })
        .then((resultdata) => {
            const shiftTemplate = mapToShiftDefinition(resultdata.id, resultdata.data);
            return res.json({ message: 'Shift definition created!', shiftTemplate: shiftTemplate });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const deleteShiftTemplate = (req: Request, res: Response) => {
    const id = req.params.id;
    db.doc(`/shift-templates/${id}`)
        .delete()
        .then((result) => {
            return res.json({ message: 'Shift template deleted!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getShiftTemplates = (_: Request, res: Response) => {
    db.collection(`/shift-templates`)
        .get()
        .then((shiftTemplateDocs) => {
            const shiftTemplates = formatFirestoreData(shiftTemplateDocs, mapToShiftDefinition);

            return res.json(shiftTemplates);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const createShiftRotation = (req: Request, res: Response) => {
    const shiftRotationToAdd: IShiftRotation = req.body;
    db.collection(`/shift-rotations`)
        .add(shiftRotationToAdd)
        .then((result) => {
            return result.get();
        })
        .then((resultdata) => {
            const shiftRotation = mapToShiftRotation(resultdata.id, resultdata.data());
            return res.json({ message: 'Shift Rotation created!', shiftRotation: shiftRotation });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const deleteShiftRotation = (req: Request, res: Response) => {
    const id = req.params.id;
    db.doc(`/shift-rotations/${id}`)
        .delete()
        .then((result) => {
            return res.json({ message: 'Shift template deleted!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getShiftRotations = (req: Request, res: Response) => {
    db.collection(`/shift-rotations`)
        .get()
        .then((shiftRotationDocs) => {
            const shiftRotations = formatFirestoreData(shiftRotationDocs, mapToShiftRotation);

            return res.json(shiftRotations);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getShiftFromUser = (req: Request, res: Response) => {
    const { user } = req.params;
    db.collection(`/shifts`)
        .where('userId', '==', user)
        .get()
        .then((shiftDocs) => {
            const shifts: IShift[] = formatFirestoreData(shiftDocs, mapToShift);

            return res.json({ shifts });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getShiftsFromTodayOnward = (req: Request, res: Response) => {
    let { user } = req.params;

    db.collection(`/shifts`)
        .where('userId', '==', user)
        .where('startDateTime', '>', new Date())
        .get()
        .then((shiftDocs) => {
            const shifts: IShift[] = formatFirestoreData(shiftDocs, mapToShift);

            return res.json({ shifts });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getShiftsFromDateRange = (req: Request, res: Response) => {
    const { user } = req.params;

    const { startRange, endRange } = req.body;

    db.collection(`/shifts`)
        .where('userId', '==', user)
        .where('startDateTime', '>', new Date(startRange))
        .where('startDateTime', '<', new Date(endRange))
        .get()
        .then((shiftDocs) => {
            const shifts: IShift[] = formatFirestoreData(shiftDocs, mapToShift);

            return res.json({ shifts });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    getShiftsAndStaffFromCompany,
    transactionShifts,
    createShiftTemplate,
    deleteShiftTemplate,
    getShiftTemplates,
    createShiftRotation,
    deleteShiftRotation,
    getShiftRotations,
    getShiftFromUser,
    getShiftsFromTodayOnward,
    getShiftsFromDateRange,
};
