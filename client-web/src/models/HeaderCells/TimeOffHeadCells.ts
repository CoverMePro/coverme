import { ITimeOffDisplay } from 'models/TimeOff';

interface ITimeOffHeadCell {
    disablePadding: boolean;
    id: keyof ITimeOffDisplay;
    label: string;
    numeric: boolean;
    capitalize: boolean;
    sortable: boolean;
}

export const staffTimeOffHeadCells: ITimeOffHeadCell[] = [
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

export const managerTimeOffHeadCells: ITimeOffHeadCell[] = [
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
