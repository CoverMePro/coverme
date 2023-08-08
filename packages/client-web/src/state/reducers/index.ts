import { combineReducers } from 'redux';
import userReducer from './user';
import companyReducer from './company';

const reducers = combineReducers({
	user: userReducer,
	company: companyReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
