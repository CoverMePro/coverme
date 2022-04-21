import { ISickDisplay } from 'models/Sick';

interface ISickRequestHeadCell {
    disablePadding: boolean;
    id: keyof ISickDisplay;
    label: string;
    numeric: boolean;
    capitalize: boolean;
    sortable: boolean;
}

export const staffSickHeadCells: ISickRequestHeadCell[] = [
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

export const managerSickHeadCells: ISickRequestHeadCell[] = [
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
