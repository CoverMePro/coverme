import { IShiftTemplateDisplay } from 'models/ShiftTemplate';
import { IHeaderCells } from './HeaderCells';

const headCells: IHeaderCells<IShiftTemplateDisplay>[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        capitalize: true,
        sortable: true,
        label: 'Shift Name',
    },
    {
        id: 'startTime',
        numeric: false,
        disablePadding: false,
        label: 'Start Time',
        sortable: true,
        capitalize: true,
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
