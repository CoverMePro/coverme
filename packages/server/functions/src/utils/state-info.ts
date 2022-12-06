import { ICompany, ITeam, IUser } from 'coverme-shared';
import { mapFireStoreData, formatFirestoreData } from './db-helpers';
import { db } from '../utils/admin';

export const gatherInfo = async (userId: string) => {
    try {
        const userData = await db.doc(`/users/${userId}`).get();
        const companyData = await db.doc('/company/info').get();

        const userInfo: IUser = mapFireStoreData(userData.id, userData.data());
        const companyInfo: ICompany = mapFireStoreData(companyData.id, companyData.data(), false);

        const teamsDoc = await db.collection('teams').where('__name__', 'in', userInfo.teams).get();

        const teams = formatFirestoreData<ITeam>(teamsDoc);

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
