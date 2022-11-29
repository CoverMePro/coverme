import { ICompany } from 'models/Company';
import { IUser } from 'models/User';
import { ActionType } from 'state/action-types';
import { SetCompanyAction, SetUserAction } from 'state/actions';

export const setUser = (user: IUser): SetUserAction => {
    return {
        type: ActionType.SET_USER,
        payload: {
            user: user,
        },
    };
};

export const setCompany = (company: ICompany): SetCompanyAction => {
    return {
        type: ActionType.SET_COMPANY,
        payload: {
            company: company,
        },
    };
};
