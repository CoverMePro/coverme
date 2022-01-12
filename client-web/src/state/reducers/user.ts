import { IUserInfo } from 'models/User';
import { ActionType } from 'state/action-types';
import { Action } from 'state/actions';

const initialState: IUserInfo = {};

const reducer = (state: IUserInfo = initialState, action: Action): IUserInfo => {
    switch (action.type) {
        case ActionType.SET_USER: {
            return { ...action.payload.user };
        }

        default:
            return state;
    }
};

export default reducer;
