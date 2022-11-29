import { ITimeOffDisplay } from '../displays/TimeOffDisplay';
import { IHeaderCells } from './HeaderCells';

export const staffTimeOffHeadCells: IHeaderCells<ITimeOffDisplay>[] = [
    {
        id: 'requestDate',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: true,
        label: 'Request Date',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Time Off Type',
    },
    {
        id: 'startDate',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Start',
    },
    {
        id: 'endDate',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'End',
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

export const managerTimeOffHeadCells: IHeaderCells<ITimeOffDisplay>[] = [
    {
        id: 'requestDate',
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
        id: 'type',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Time Off Type',
    },
    {
        id: 'startDate',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Start',
    },
    {
        id: 'endDate',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'End',
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
