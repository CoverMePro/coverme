import { IStaff } from 'coverme-shared';
import { ActionType } from 'state/action-types';
import { Action } from 'state/actions';

const initialState: IStaff = {
	id: '',
	firstName: '',
	lastName: '',
	phone: '',
	company: '',
	hireDate: new Date(),
	employeeType: 'Full-Time',
	teams: [],
	contactBy: '',
};

const reducer = (state: IStaff = initialState, action: Action): IStaff => {
	switch (action.type) {
		case ActionType.SET_STAFF: {
			return { ...action.payload.staff };
		}
		default:
			return state;
	}
};
export default reducer;
