import { ICompany } from 'coverme-shared';
import { ActionType } from 'state/action-types';
import { Action } from 'state/actions';

const initialState: ICompany = {
    name: '',
    email: '',
    phone: '',
};

const reducer = (state: ICompany = initialState, action: Action): ICompany => {
    switch (action.type) {
        case ActionType.SET_COMPANY: {
            return { ...action.payload.company };
        }

        default:
            return state;
    }
};

export default reducer;
