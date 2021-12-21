import { IUserInfo } from 'models/User';

interface IStaffHeadCell {
	disablePadding: boolean;
	id: keyof IUserInfo;
	label: string;
	numeric: boolean;
	capitalize: boolean;
}

const headCells: IStaffHeadCell[] = [
	{
		id: 'email',
		numeric: false,
		disablePadding: false,
		capitalize: false,
		label: 'Email'
	},
	{
		id: 'firstName',
		numeric: false,
		disablePadding: false,
		capitalize: true,
		label: 'First Name'
	},
	{
		id: 'lastName',
		numeric: false,
		disablePadding: false,
		label: 'Last Name',
		capitalize: true
	},
	{
		id: 'role',
		numeric: false,
		disablePadding: false,
		label: 'Role',
		capitalize: true
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'Status',
		capitalize: true
	}
];

export default headCells;
