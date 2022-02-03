import { Request, Response } from 'express';
import { ITeamInfo } from '../models/Team';
import { db } from '../utils/admin';

/**
 * Get all teams within a company
 */
const getAllTeams = (req: Request, res: Response) => {
    db.collection(`/companies/${req.params.id}/teams`)
        .get()
        .then((teamData) => {
            let teams: ITeamInfo[] = [];
            teamData.forEach((team) => {
                teams.push({
                    name: team.id,
                    owner: team.data().owner,
                    managers: team.data().managers,
                    staff: team.data().staff,
                });
            });

            return res.json(teams);
        })
        .catch((err) => {
            console.log(err);
        });
};

/**
 * Create a team within a company
 */

const createTeam = (req: Request, res: Response) => {
    const team: ITeamInfo = req.body.team;
    db.doc(`/companies/${req.params.id}/teams/${team.name}`)
        .get()
        .then((teamData) => {
            if (teamData.exists) {
                // err
                throw 403;
            } else {
                return db
                    .doc(`/companies/${req.params.id}/teams/${team.name}`)
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
                return res.status(500).json({ error: err.code });
            }
        });
};

/**
 * Delete a team from a company
 */

const deleteTeam = (req: Request, res: Response) => {
    const { companyId, teamId } = req.params;

    db.doc(`/companies/${companyId}/teams/${teamId}`)
        .delete()
        .then(() => {
            db.collection('/users')
                .where('teams', 'array-contains', teamId)
                .get()
                .then(async (userData) => {
                    const batch = db.batch();
                    userData.forEach(async (doc) => {
                        const user = db.doc(`/users/${doc.id}`);
                        const userData = doc.data();

                        const teams = userData.teams.filter((t: any) => t != teamId);

                        batch.update(user, { teams: teams });
                    });

                    return batch.commit();
                });
        })
        .then(() => {
            return res.json({ message: 'Team Deleted!' });
        })
        .catch((err) => {
            return res.status(500).json({ error: err.code });
        });
};

const addUserToTeam = (req: Request, res: Response) => {
    const { companyId, teamId } = req.params;
    const user = req.body.user;

    // add user to team doc
    db.doc(`/companies/${companyId}/teams/${teamId}`)
        .get()
        .then((teamResult) => {
            const team = teamResult.data();

            if (team) {
                if (user.role === 'manager') {
                    team.managers.push(user.email);
                } else {
                    team.staff.push(user.email);
                }

                return db.doc(`/companies/${companyId}/teams/${teamId}`).set(team);
            }
            throw Error('Team not found!');
        })
        .then(() => {
            return db.doc(`/users/${user.email}`).get();
        })
        .then((userResult) => {
            const userData = userResult.data();

            if (userData) {
                if (userData.teams) {
                    userData.teams.push(teamId);
                } else {
                    userData.teams = [teamId];
                }

                return db.doc(`/users/${user.email}`).set(userData);
            }

            throw Error('User not found!');
        })
        .then(() => {
            return res.json({ message: 'User added to team!' });
        })
        .catch((err) => {
            return res.status(500).json({ error: err.code });
        });
};

const removeUserFromTeam = (req: Request, res: Response) => {
    const { companyId, teamId } = req.params;
    const user = req.body.user;

    // add user to team doc
    db.doc(`/companies/${companyId}/teams/${teamId}`)
        .get()
        .then((teamResult) => {
            const team = teamResult.data();

            if (team) {
                let newTeams = [];
                if (user.role === 'manager') {
                    newTeams = team.managers.filter((manager: string) => manager !== user.email);

                    team.managers = newTeams;
                } else {
                    newTeams = team.staff.filter((staff: string) => staff !== user.email);

                    team.staff = newTeams;
                }

                return db.doc(`/companies/${companyId}/teams/${teamId}`).set(team);
            }
            throw Error('Team not found!');
        })
        .then(() => {
            return db.doc(`/users/${user.email}`).get();
        })
        .then((userResult) => {
            const userData = userResult.data();

            if (userData) {
                if (userData.teams) {
                    const newTeams = userData.teams.filter((team: string) => team !== teamId);

                    userData.teams = newTeams;
                }

                return db.doc(`/users/${user.email}`).set(userData);
            }

            throw Error('User not found!');
        })
        .then(() => {
            return res.json({ message: 'User added to team!' });
        })
        .catch((err) => {
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
