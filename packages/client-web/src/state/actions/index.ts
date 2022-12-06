import { ICompany, IUser } from 'coverme-shared';
import { ActionType } from 'state/action-types';

export interface SetUserAction {
    type: ActionType.SET_USER;
    payload: {
        user: IUser;
    };
}

export interface SetCompanyAction {
    type: ActionType.SET_COMPANY;
    payload: {
        company: ICompany;
    };
}

export type Action = SetUserAction | SetCompanyAction;
