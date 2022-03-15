import { IUser } from 'models/User';

interface IStaffHeadCell {
    disablePadding: boolean;
    id: keyof IUser;
    label: string;
    numeric: boolean;
    capitalize: boolean;
    sortable: boolean;
}

const headCells: IStaffHeadCell[] = [
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: true,
        label: 'Email',
    },
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
        id: 'role',
        numeric: false,
        disablePadding: false,
        label: 'Role',
        sortable: true,
        capitalize: true,
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
        sortable: true,
        capitalize: true,
    },
];

export default headCells;
