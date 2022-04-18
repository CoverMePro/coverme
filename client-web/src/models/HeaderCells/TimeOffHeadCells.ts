import { ITimeOffDisplay } from 'models/TimeOff';

interface ITimeOffHeadCell {
    disablePadding: boolean;
    id: keyof ITimeOffDisplay;
    label: string;
    numeric: boolean;
    capitalize: boolean;
    sortable: boolean;
}

const headCells: ITimeOffHeadCell[] = [
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

export default headCells;
