import { INav } from 'models/Nav';

import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import TodayIcon from '@mui/icons-material/Today';
import ArticleIcon from '@mui/icons-material/Article';
import TimerIcon from '@mui/icons-material/Timer';

export const mainNav: INav[] = [
    { label: 'Home', path: 'home', selectedIndex: 0, icon: <HomeIcon color="secondary" /> },
    {
        label: 'Calendar',
        path: 'calendar',
        selectedIndex: 1,
        icon: <TodayIcon color="secondary" />,
    },
    {
        label: 'Schedule',
        path: 'schedule',
        selectedIndex: 2,
        icon: <CalendarViewMonthIcon color="secondary" />,
    },
];

export const companyNav: INav[] = [
    {
        label: 'Staff',
        path: 'staff',
        selectedIndex: 3,
        icon: <PeopleIcon color="secondary" />,
    },
    { label: 'Teams', path: 'teams', selectedIndex: 4, icon: <GroupWorkIcon color="secondary" /> },
    { label: 'Blog', path: 'blog', selectedIndex: 5, icon: <ArticleIcon color="secondary" /> },
];

export const managmentNav: INav[] = [
    {
        label: 'Shifts',
        path: 'shifts',
        selectedIndex: 6,
        icon: <ScheduleIcon color="secondary" />,
    },
];

export const overtimeNav: INav[] = [
    {
        label: 'Overtime',
        path: 'overtime',
        selectedIndex: 11,
        icon: <TimerIcon color="secondary" />,
    },
];

export const adminNav: INav[] = [
    {
        label: 'Companies',
        path: 'companies',
        selectedIndex: 7,
        icon: <BusinessIcon color="secondary" />,
    },
];
