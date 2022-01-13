import { Request, Response } from 'express';
import { IUser } from '../models/User';
import { db } from '../utils/admin';

const getStaffandShiftsFromTeams = (req: Request, res: Response) => {
    const teams: string[] = req.body.teams;

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

            const teamStaff: any = [];

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

            return res.json({ teamStaff: teamStaff });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    getStaffandShiftsFromTeams,
};
