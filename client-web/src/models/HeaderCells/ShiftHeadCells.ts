import { IShiftTemplate } from 'models/ShiftTemplate';
import { IHeaderCells } from './HeaderCells';

const headCells: IHeaderCells<IShiftTemplate>[] = [
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
