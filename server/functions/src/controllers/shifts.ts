import { Request, Response } from 'express';
import { IScheduleStaff } from '../models/ScheduleInfo';
import { IShift, IShiftTemplate, mapToShift, mapToShiftDefinition } from '../models/Shift';
import { IShiftTransaction } from '../models/ShiftTransaction';
import { ITimeOff, mapToTimeOff } from '../models/TimeOff';
import { db } from '../utils/admin';
import { formatFirestoreData } from '../utils/db-helpers';

const getShiftsAndStaffFromCompany = (req: Request, res: Response) => {
    const teamStaff: IScheduleStaff[] = [];
    let shifts: IShift[] = [];
    const timeOff: ITimeOff[] = [];
    const shiftDefs: IShiftTemplate[] = [];

    const teams: string[] = [];

    db.collection('users')
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

            return db.collection(`/shifts`).get();
        })
        .then((shiftDocs) => {
            shifts = formatFirestoreData(shiftDocs, mapToShift);

            return db.collection(`/time-off`).get();
        })
        .then((timeOffDocs) => {
            timeOffDocs.forEach((doc) => {
                timeOff.push(mapToTimeOff(doc.id, doc.data()));
            });

            return db.collection(`/shift-templates`).get();
        })
        .then((shiftDefinitionDocs) => {
            shiftDefinitionDocs.forEach((doc) => {
                shiftDefs.push(mapToShiftDefinition(doc.id, doc.data()));
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

/**
 *  Organize and carry out specific db request based on transactions (add, change, remove)
 */
const transactionShifts = (req: Request, res: Response) => {
    const batch = db.batch();

    const transactions: IShiftTransaction[] = req.body.transactions;

    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        console.log(transaction);
        switch (transaction.type) {
            case 'add':
                batch.create(db.collection(`/shifts`).doc(), {
                    name: transaction.name,
                    userId: transaction.userId === '' ? 'unclaimed' : transaction.userId,
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
            const shiftTemplate: IShiftTemplate = {
                id: resultdata.id,
                name: resultdata.data()!.name,
                duration: resultdata.data()!.duration,
            };
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
            console.log(result);
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
            const shiftTemplates: IShiftTemplate[] = [];
            shiftTemplateDocs.forEach((shiftTemplateDoc) => {
                shiftTemplates.push({
                    id: shiftTemplateDoc.id,
                    name: shiftTemplateDoc.data().name,
                    duration: shiftTemplateDoc.data().duration,
                });
            });

            return res.json(shiftTemplates);
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
    getShiftFromUser,
    getShiftsFromTodayOnward,
    getShiftsFromDateRange,
};
