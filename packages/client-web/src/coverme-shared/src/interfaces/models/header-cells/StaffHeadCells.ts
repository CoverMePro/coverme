import { IStaff } from '../Staff';
import { IHeaderCells } from './HeaderCells';

export const StaffHeadCells: IHeaderCells<IStaff>[] = [
	{
		id: 'firstName',
		numeric: false,
		disablePadding: false,
		capitalize: true,
		sortable: true,
		label: 'First Name',
	},
	{
		id: 'lastName',
		numeric: false,
		disablePadding: false,
		label: 'Last Name',
		sortable: true,
		capitalize: true,
	},
	{
		id: 'employeeType',
		numeric: false,
		disablePadding: false,
		label: 'Staff Type',
		sortable: true,
		capitalize: true,
	},
	{
		id: 'hireDateDisplay',
		numeric: false,
		disablePadding: false,
		label: 'Hire Date',
		sortable: true,
		capitalize: true,
	},
	{
		id: 'phone',
		numeric: false,
		disablePadding: false,
		label: 'Phone #',
		sortable: true,
		capitalize: true,
	},
	{
		id: 'contactBy',
		numeric: false,
		disablePadding: false,
		label: 'Contact By',
		sortable: true,
		capitalize: true,
	},
];
