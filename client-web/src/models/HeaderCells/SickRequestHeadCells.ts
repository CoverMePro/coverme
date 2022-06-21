import { ISickDisplay } from 'models/Sick';
import { IHeaderCells } from './HeaderCells';

export const staffSickHeadCells: IHeaderCells<ISickDisplay>[] = [
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: true,
        label: 'Request Date',
    },
    {
        id: 'shift',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Shift',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Status',
    },
];

export const managerSickHeadCells: IHeaderCells<ISickDisplay>[] = [
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: true,
        label: 'Request Date',
    },
    {
        id: 'user',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: true,
        label: 'Staff',
    },
    {
        id: 'shift',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Shift',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Status',
    },
];
