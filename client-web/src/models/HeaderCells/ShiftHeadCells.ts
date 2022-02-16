import { IShift } from 'models/Shift';
import { IUser } from 'models/User';

interface IShiftDefinition {
    name: string;
    durationHours: string;
    colour: string;
}

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
        id: 'durationHours',
        numeric: false,
        disablePadding: false,
        label: 'Duration',
        capitalize: true,
    },
    {
        id: 'colour',
        numeric: false,
        disablePadding: false,
        label: 'Colour',
        capitalize: true,
    },
];

export default headCells;
