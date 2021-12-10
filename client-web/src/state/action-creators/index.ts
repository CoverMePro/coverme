import { IUserInfo } from 'models/User';
import { ActionType } from 'state/action-types';
import { SetUserAction } from 'state/actions';

export const setUser = (user: IUserInfo): SetUserAction => {
	return {
		type: ActionType.SET_USER,
		payload: {
			user: user
		}
	};
};
