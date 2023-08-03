import { combineReducers } from 'redux';
import userReducer from './user';
import staffReducer from './staff';
import companyReducer from './company';

const reducers = combineReducers({
	user: userReducer,
	staff: staffReducer,
	company: companyReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
