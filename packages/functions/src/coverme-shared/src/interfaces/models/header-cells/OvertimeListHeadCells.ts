import { IStaff } from '../Staff';
import { IHeaderCells } from './HeaderCells';

export const OvertimeHeadCells: IHeaderCells<IStaff>[] = [
	{
		id: 'firstName',
		numeric: false,
		disablePadding: false,
		capitalize: true,
		sortable: false,
		label: 'First Name',
	},
	{
		id: 'lastName',
		numeric: false,
		disablePadding: false,
		label: 'Last Name',
		sortable: false,
		capitalize: true,
	},
	{
		id: 'hireDateDisplay',
		numeric: false,
		disablePadding: false,
		label: 'Hire Date',
		sortable: false,
		capitalize: true,
	},
	{
		id: 'lastCalledOut',
		numeric: false,
		disablePadding: false,
		label: 'Last Called Out',
		sortable: false,
		capitalize: true,
	},
];
