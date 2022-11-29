import { IUser } from '../User';
import { IHeaderCells } from './HeaderCells';

const headCells: IHeaderCells<IUser>[] = [
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
        id: 'lastCalledOut',
        numeric: false,
        disablePadding: false,
        label: 'Last Called Out',
        sortable: false,
        capitalize: true,
    },
];

export default headCells;
