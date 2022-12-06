import { IUser } from 'coverme-shared';
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
    hireDate: new Date(),
    employeeType: 'Full-Time',
    status: 'Active',
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
