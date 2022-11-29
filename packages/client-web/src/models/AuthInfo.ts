import { ICompany } from './Company';
import { IUser } from './User';

export interface IAuthInfo {
    userInfo: IUser;
    companyInfo: ICompany;
}
