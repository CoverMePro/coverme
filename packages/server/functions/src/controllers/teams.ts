import { Request, Response } from 'express';
import { ITeam, IUser } from 'coverme-shared';
import {
    deleteDocument,
    documentExistsById,
    getCollection,
    getCollectionWithCondition,
    getDocumentById,
    getDocumentSnapshot,
    setDocument,
} from '../db/db-handler';
import { getBatch } from '../db/batch-handler';

const getAllTeams = async (_: Request, res: Response) => {
    try {
        const teams = await getCollection<ITeam>('teams');

        return res.json(teams);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const createTeam = async (req: Request, res: Response) => {
    const team: ITeam = req.body.team;
    try {
        const teamExist = await documentExistsById('teams', team.name);

        if (teamExist) {
            return res.status(403).json({ error: 'Team with that name already exists' });
        }

        await setDocument('teams', team.name, {
            managers: team.managers,
            staff: team.staff,
            owner: team.owner,
            color: team.color,
        });

        const emails = [...team.managers, ...team.staff, team.owner];

        if (emails.length > 0) {
            const batch = getBatch();

            const users = await getCollectionWithCondition<IUser>(
                'users',
                '__name__',
                'in',
                emails
            );

            users.forEach(async (user) => {
                let teams = [];

                const userDoc = getDocumentSnapshot(`users/${user.id}`);

                if (user.teams) {
                    teams = [...user.teams, team.name];
                } else {
                    teams = [team.name];
                }

                batch.update(userDoc, { teams: teams });
            });

            await batch.commit();
        }

        return res.json({ message: 'Team Created!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const deleteTeam = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        await deleteDocument('teams', name);

        const users = await getCollectionWithCondition<IUser>(
            'users',
            'teams',
            'array-contains',
            name
        );
        const batch = getBatch();

        users.forEach(async (user) => {
            const userDoc = getDocumentSnapshot(`users/${user.id}`);

            const teams = user.teams.filter((t: any) => t != name);

            batch.update(userDoc, { teams: teams });
        });

        await batch.commit();

        return res.json({ message: 'Team Deleted!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const addUserToTeam = async (req: Request, res: Response) => {
    const { name } = req.params;
    const user = req.body.user;

    try {
        const team = await getDocumentById<ITeam>('teams', name);

        if (user.role === 'manager') {
            team.managers.push(user.id);
        } else {
            team.staff.push(user.id);
        }

        const teamData: any = {
            ...team,
        };

        delete teamData.name;

        await setDocument('teams', name, teamData);

        const userData: any = await getDocumentById<IUser>('users', user.id);

        delete userData.id;

        if (userData.teams) {
            userData.teams.push(name);
        } else {
            userData.teams = [name];
        }

        await setDocument('users', user.id, userData);

        return res.json({ message: 'User added to team!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

const removeUserFromTeam = async (req: Request, res: Response) => {
    const { name } = req.params;
    const user = req.body.user;

    try {
        const team = await getDocumentById<ITeam>('teams', name);

        let newTeams = [];
        if (user.role === 'manager') {
            newTeams = team.managers.filter((manager: string) => manager !== user.id);

            team.managers = newTeams;
        } else {
            newTeams = team.staff.filter((staff: string) => staff !== user.id);

            team.staff = newTeams;
        }

        const teamData: any = {
            ...team,
        };

        delete teamData.name;

        await setDocument('teams', name, teamData);

        const userData: any = await getDocumentById<IUser>('users', user.id);

        delete userData.id;

        if (userData.teams) {
            const newTeams = userData.teams.filter((team: string) => team !== name);

            userData.teams = newTeams;
        }

        await setDocument('users', user.id, userData);

        return res.json({ message: 'User added to team!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
};

export default {
    createTeam,
    getAllTeams,
    deleteTeam,
    addUserToTeam,
    removeUserFromTeam,
};
