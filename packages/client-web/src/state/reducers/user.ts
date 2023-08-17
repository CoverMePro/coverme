import { IUser } from 'coverme-shared';
import { ActionType } from 'state/action-types';
import { Action } from 'state/actions';

const initialState: IUser = {
	id: '',
	email: '',
	firstName: '',
	lastName: '',
	phone: '',
	role: 'Manager',
	status: 'Active',
	teams: [],
	employeeType: 'Full-Time',
	company: '',
	hireDate: new Date(),
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
