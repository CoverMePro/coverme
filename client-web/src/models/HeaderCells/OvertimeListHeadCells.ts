import { IUser } from 'models/User';

interface IOvertimeListHeadCells {
    disablePadding: boolean;
    id: keyof IUser;
    label: string;
    numeric: boolean;
    capitalize: boolean;
    sortable: boolean;
}

const headCells: IOvertimeListHeadCells[] = [
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Email',
    },
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
        id: 'hireDate',
        numeric: false,
        disablePadding: false,
        label: 'Hire Date',
        sortable: false,
        capitalize: true,
    },
    {
        id: 'overtimeCalloutDate',
        numeric: false,
        disablePadding: false,
        label: 'Last Overtime Accepted',
        sortable: false,
        capitalize: true,
    },
];

export default headCells;
