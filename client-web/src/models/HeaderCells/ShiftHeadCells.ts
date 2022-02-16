import { IShiftDefinition } from 'models/ShiftDefinition';

interface IShiftHeadCell {
    disablePadding: boolean;
    id: keyof IShiftDefinition;
    label: string;
    numeric: boolean;
    capitalize: boolean;
}

const headCells: IShiftHeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        capitalize: true,
        label: 'Shift Name',
    },
    {
        id: 'duration',
        numeric: false,
        disablePadding: false,
        label: 'Duration (HH:MM)',
        capitalize: true,
    },
];

export default headCells;
