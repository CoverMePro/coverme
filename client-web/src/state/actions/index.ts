import { IUserInfo } from 'models/User';
import { ActionType } from 'state/action-types';

export interface SetUserAction {
	type: ActionType.SET_USER;
	payload: {
		user: IUserInfo;
	};
}

export type Action = SetUserAction;
