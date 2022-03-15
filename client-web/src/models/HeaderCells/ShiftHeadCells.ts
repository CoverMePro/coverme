import { IShiftDefinition } from 'models/ShiftDefinition';

interface IShiftHeadCell {
    disablePadding: boolean;
    id: keyof IShiftDefinition;
    label: string;
    numeric: boolean;
    capitalize: boolean;
    sortable: boolean;
}

const headCells: IShiftHeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        capitalize: true,
        sortable: true,
        label: 'Shift Name',
    },
    {
        id: 'duration',
        numeric: false,
        disablePadding: false,
        label: 'Duration (HH:MM)',
        sortable: true,
        capitalize: true,
    },
];

export default headCells;
