import { Request, Response } from 'express';
import { ICompanyInfo } from '../models/Company';
import { ITeamInfo } from '../models/Team';
import { db, fbAuth } from '../utils/admin';
import { emailSignInForUser } from '../utils/fb-emails';

/**
 * Get all companies in the database
 */
const getAllCompanies = (req: Request, res: Response) => {
    console.log('here');
    db.collection('/companies')
        .get()
        .then((companyData) => {
            let companies: string[] = [];
            companyData.forEach((data) => {
                companies.push(data.id);
            });

            return res.json(companies);
        })
        .catch((err) => {
            console.log(err);
        });
};

/**
 * Get a company based on their ID (name)
 */
const getCompany = (req: Request, res: Response) => {
    db.doc(`/companies/${req.params.id}`)
        .get()
        .then((companyData) => {
            if (companyData.exists) {
                const companyInfo: ICompanyInfo = {
                    name: companyData.id,
                    data: {
                        ...companyData.data(),
                    },
                };
                return res.json(companyInfo);
            } else {
                return res.status(404).json({ error: 'Company not found' });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

/**
 * A check if a company name already exist in database (for creating company)
 */
const checkCompany = (req: Request, res: Response) => {
    db.doc(`/companies/${req.params.id}`)
        .get()
        .then((companyData) => {
            if (companyData.exists) {
                return res.json({ exists: true });
            } else {
                return res.json({ exists: false });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

/**
 * Creates a company and a user who owns the company (defaulted to manager role)
 */
const createCompany = async (req: Request, res: Response) => {
    const companyName = req.body.company.name;
    const companyInfo = req.body.company.data;

    const ownerEmail = req.body.owner.email;
    const ownerInfo = req.body.owner.data;

    db.doc(`/companies/${companyName}`)
        .get()
        .then((companyData) => {
            if (companyData.exists) {
                throw 403;
            } else {
                return db.doc(`/companies/${companyName}`).set(companyInfo);
            }
        })
        .then(() => {
            return emailSignInForUser(fbAuth, {
                email: ownerEmail,
                ...ownerInfo,
                companyName,
            });
        })
        .then(() => {
            return res.status(201).json({
                message: 'Company Created!',
            });
        })
        .catch((err) => {
            if (err === 403) {
                return res.status(403).json({ error: 'Company with that name already exists' });
            } else {
                return res.status(500).json({ error: err.code });
            }
        });
};

/**
 * Delete a company based on the ID (name)
 */
const deleteCompany = (req: Request, res: Response) => {
    db.doc(`/companies/${req.params.id}`)
        .delete()
        .then(() => {
            return res.json({ message: 'Company deleted successfully!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

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

// const addUserToTeam = (req: Request, res: Response) => {
//   const userId = req.params.id;
//   const team = req.body.team;
//   db.doc(`/users/${userId}`)
//     .get()
//     .then((userData) => {
//       let newTeams = [team];
//       const data = userData.data();

//       if (data && data.teams) {
//         newTeams = [...data.teams, team];
//       }

//       return db.doc(`/users/${userId}`).update({
//         teams: newTeams,
//       });
//     })
//     .then(() => {
//       return res.json({ message: 'Team added to User!' });
//     })
//     .catch((err) => {
//       console.error(err);
//       return res.status(500).json({ error: err.code });
//     });
// };

// const removeUserFromTeam = async (req: Request, res: Response) => {
//   const userId = req.params.id;
//   const team = req.body.team;
//   db.doc(`/users/${userId}`)
//     .get()
//     .then((userData) => {
//       let newTeams: any = [];
//       const data = userData.data();

//       if (data && data.teams) {
//         newTeams = data.teams.filter((t: any) => t !== team);
//       }

//       return db.doc(`/users/${userId}`).update({
//         teams: newTeams,
//       });
//     })
//     .then(() => {
//       return res.json({ message: 'Team added to User!' });
//     })
//     .catch((err) => {
//       console.error(err);
//       return res.status(500).json({ error: err.code });
//     });
// };

export default {
    createCompany,
    getCompany,
    checkCompany,
    getAllCompanies,
    deleteCompany,
    createTeam,
    getAllTeams,
    deleteTeam,
};
