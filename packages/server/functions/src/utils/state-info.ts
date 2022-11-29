import { ICompany, mapToCompany } from '../models/Company';
import { ITeam, mapToTeams } from '../models/Team';
import { IUser, mapToUser } from '../models/User';
import { db } from '../utils/admin';
import { formatFirestoreData } from './db-helpers';

export const gatherInfo = async (userId: string) => {
    try {
        const userData = await db.doc(`/users/${userId}`).get();
        const companyData = await db.doc('/company/info').get();

        const userInfo: IUser = mapToUser(userData.id, userData.data());
        const companyInfo: ICompany = mapToCompany(companyData.data());

        const teamsDoc = await db.collection('teams').where('__name__', 'in', userInfo.teams).get();

        const teams = formatFirestoreData<ITeam>(teamsDoc, mapToTeams);

        const managers: string[] = [];

        teams.forEach((team) => {
            team.managers.forEach((manager) => {
                managers.push(manager);
            });
        });

        userInfo.reportTo = managers;

        return {
            userInfo,
            companyInfo,
        };
    } catch (err) {
        throw err;
    }
};
