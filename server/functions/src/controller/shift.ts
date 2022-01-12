import { Request, Response } from 'express';
import { IUserInfo } from '../models/User';
import { db } from '../utils/admin';

const getStaffandShiftsFromTeams = (req: Request, res: Response) => {
    const teams: string[] = req.body.teams;

    db.collection('users')
        .where('teams', 'array-contains-any', teams)
        .get()
        .then((staffData) => {
            const staffList: IUserInfo[] = [];

            staffData.forEach((user) => {
                staffList.push({ email: user.id, ...user.data() });
            });

            return res.json({ staff: staffList });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    getStaffandShiftsFromTeams,
};
