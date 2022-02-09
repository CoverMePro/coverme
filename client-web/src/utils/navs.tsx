import { INav } from 'models/Nav';

import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import GroupWorkIcon from '@mui/icons-material/GroupWork';

export const mainNav: INav[] = [
    { label: 'Home', path: 'home', selectedIndex: 0, icon: <HomeIcon color="secondary" /> },
];

export const adminNav: INav[] = [
    {
        label: 'Companies',
        path: 'companies',
        selectedIndex: 1,
        icon: <BusinessIcon color="secondary" />,
    },
];

export const ownerNav: INav[] = [
    {
        label: 'Staff',
        path: 'staff-view',
        selectedIndex: 2,
        icon: <PeopleIcon color="secondary" />,
    },
    { label: 'Teams', path: 'teams', selectedIndex: 3, icon: <GroupWorkIcon color="secondary" /> },
];
