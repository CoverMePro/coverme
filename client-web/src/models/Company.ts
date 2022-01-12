import { ITeamInfo } from './Team';

export interface ICompany {
    name?: string;
    email?: string;
    phoneNo?: string;
    teams?: ITeamInfo[];
}
