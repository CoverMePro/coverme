import { ICompany } from '../Company';
import { IHeaderCells } from './HeaderCells';

const companyHeadCells: IHeaderCells<ICompany>[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: true,
        label: 'Name',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: true,
        label: 'Email',
    },
    {
        id: 'phone',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Phone Number',
    },
];

export default companyHeadCells;
