import { IUser } from 'models/User';
import { ActionType } from 'state/action-types';

export interface SetUserAction {
    type: ActionType.SET_USER;
    payload: {
        user: IUser;
    };
}

export type Action = SetUserAction;
