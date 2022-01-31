import { ICompany } from 'models/Company';

interface ICompanyHeadCells {
    disablePadding: boolean;
    id: keyof ICompany;
    label: string;
    numeric: boolean;
    capitalize: boolean;
}

const companyHeadCells: ICompanyHeadCells[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        label: 'Name',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        label: 'Email',
    },
    {
        id: 'phoneNo',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        label: 'Phone Number',
    },
];

export default companyHeadCells;
