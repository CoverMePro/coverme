import { Request, Response } from 'express';
import { ITeam, mapToTeams } from '../models/Team';
import { db } from '../utils/admin';
import { formatFirestoreData } from '../utils/db-helpers';

// TO DO: Refactor and clean this up better (theres gotta be a way)

const getAllTeams = (_: Request, res: Response) => {
    db.collection(`/teams`)
        .get()
        .then((teamDocs) => {
            const teams: ITeam[] = formatFirestoreData(teamDocs, mapToTeams);

            return res.json(teams);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const createTeam = (req: Request, res: Response) => {
    const team: ITeam = req.body.team;
    db.doc(`/teams/${team.name}`)
        .get()
        .then((teamData) => {
            if (teamData.exists) {
                // err
                throw 403;
            } else {
                return db
                    .doc(`/teams/${team.name}`)
                    .set({ managers: team.managers, staff: team.staff, owner: team.owner });
            }
        })
        .then(async () => {
            const emails = [...team.managers, ...team.staff, team.owner];
            if (emails.length > 0) {
                const batch = db.batch();
                db.collection('/users')
                    .where('__name__', 'in', emails)
                    .get()
                    .then(async (userData) => {
                        userData.forEach(async (doc) => {
                            let teams = [];
                            const user = db.doc(`/users/${doc.id}`);
                            const userData = doc.data();

                            if (userData && userData.teams) {
                                teams = [...userData.teams, team.name];
                            } else {
                                teams = [team.name];
                            }

                            batch.update(user, { teams: teams });
                        });

                        return batch.commit();
                    });
            } else {
                return new Promise<void>((resolve, reject) => {});
            }
        })
        .then(() => {
            return res.json({ message: 'Team Created!' });
        })
        .catch((err) => {
            if (err === 403) {
                return res.status(403).json({ error: 'Team with that name already exists' });
            } else {
                console.error(err);
                return res.status(500).json({ error: err.code });
            }
        });
};

/**
 * Delete a team from a company
 */

const deleteTeam = (req: Request, res: Response) => {
    const { name } = req.params;

    db.doc(`/teams/${name}`)
        .delete()
        .then(() => {
            db.collection('/users')
                .where('teams', 'array-contains', name)
                .get()
                .then(async (userData) => {
                    const batch = db.batch();
                    userData.forEach(async (doc) => {
                        const user = db.doc(`/users/${doc.id}`);
                        const userData = doc.data();

                        const teams = userData.teams.filter((t: any) => t != name);

                        batch.update(user, { teams: teams });
                    });

                    return batch.commit();
                });
        })
        .then(() => {
            return res.json({ message: 'Team Deleted!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const addUserToTeam = (req: Request, res: Response) => {
    const { name } = req.params;
    const user = req.body.user;

    // add user to team doc
    db.doc(`/teams/${name}`)
        .get()
        .then((teamDoc) => {
            const team = teamDoc.data();

            if (team) {
                if (user.role === 'manager') {
                    team.managers.push(user.id);
                } else {
                    team.staff.push(user.id);
                }

                return db.doc(`/teams/${name}`).set(team);
            }
            throw Error('Team not found!');
        })
        .then(() => {
            return db.doc(`/users/${user.id}`).get();
        })
        .then((userResult) => {
            const userData = userResult.data();

            if (userData) {
                if (userData.teams) {
                    userData.teams.push(name);
                } else {
                    userData.teams = [name];
                }

                return db.doc(`/users/${user.id}`).set(userData);
            }

            throw Error('User not found!');
        })
        .then(() => {
            return res.json({ message: 'User added to team!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const removeUserFromTeam = (req: Request, res: Response) => {
    const { name } = req.params;
    const user = req.body.user;

    // add user to team doc
    db.doc(`/teams/${name}`)
        .get()
        .then((teamResult) => {
            const team = teamResult.data();

            if (team) {
                let newTeams = [];
                if (user.role === 'manager') {
                    newTeams = team.managers.filter((manager: string) => manager !== user.id);

                    team.managers = newTeams;
                } else {
                    newTeams = team.staff.filter((staff: string) => staff !== user.id);

                    team.staff = newTeams;
                }

                return db.doc(`/teams/${name}`).set(team);
            }
            throw Error('Team not found!');
        })
        .then(() => {
            return db.doc(`/users/${user.id}`).get();
        })
        .then((userResult) => {
            const userData = userResult.data();

            if (userData) {
                if (userData.teams) {
                    const newTeams = userData.teams.filter((team: string) => team !== name);

                    userData.teams = newTeams;
                }

                return db.doc(`/users/${user.id}`).set(userData);
            }

            throw Error('User not found!');
        })
        .then(() => {
            return res.json({ message: 'User added to team!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    createTeam,
    getAllTeams,
    deleteTeam,
    addUserToTeam,
    removeUserFromTeam,
};
