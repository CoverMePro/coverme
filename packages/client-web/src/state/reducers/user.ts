import { IUser } from 'models/User';
import { ActionType } from 'state/action-types';
import { Action } from 'state/actions';

const initialState: IUser = {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: '',
    company: '',
    employeeType: 'Full-Time',
    teams: [],
};

const reducer = (state: IUser = initialState, action: Action): IUser => {
    switch (action.type) {
        case ActionType.SET_USER: {
            return { ...action.payload.user };
        }

        default:
            return state;
    }
};

export default reducer;
