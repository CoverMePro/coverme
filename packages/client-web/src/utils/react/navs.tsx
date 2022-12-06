import { INav } from 'coverme-shared';

import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import TodayIcon from '@mui/icons-material/Today';
import ArticleIcon from '@mui/icons-material/Article';
import TimerIcon from '@mui/icons-material/Timer';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FlightIcon from '@mui/icons-material/Flight';
import SickIcon from '@mui/icons-material/Sick';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

export const mainNav: INav[] = [
    { label: 'Home', path: 'home', selectedIndex: 0, icon: <HomeIcon color="secondary" /> },
    {
        label: 'Calendar',
        path: 'calendar',
        selectedIndex: 1,
        icon: <TodayIcon color="secondary" />,
    },

    {
        label: 'Staff',
        path: 'staff',
        selectedIndex: 3,
        icon: <PeopleIcon color="secondary" />,
    },
    { label: 'Teams', path: 'teams', selectedIndex: 4, icon: <GroupWorkIcon color="secondary" /> },
    {
        label: 'Message Board',
        path: 'blog',
        selectedIndex: 5,
        icon: <ArticleIcon color="secondary" />,
    },
];

export const managmentNav: INav[] = [
    {
        label: 'Shifts',
        path: 'shifts',
        selectedIndex: 6,
        icon: <ScheduleIcon color="secondary" />,
    },
    {
        label: 'Schedule',
        path: 'schedule',
        selectedIndex: 2,
        icon: <CalendarViewMonthIcon color="secondary" />,
    },
    {
        label: 'Requests',
        path: 'requests',
        selectedIndex: 13,
        icon: <QuestionAnswerIcon color="secondary" />,
    },
];

export const overtimeNav: INav[] = [
    {
        label: 'Overtime List',
        path: 'overtime/list',
        selectedIndex: 11,
        icon: <FormatListNumberedIcon color="secondary" />,
    },
    {
        label: 'Overtime Callouts',
        path: 'overtime/callouts',
        selectedIndex: 12,
        icon: <TimerIcon color="secondary" />,
    },
];

export const adminNav: INav[] = [
    { label: 'Home', path: 'home', selectedIndex: 0, icon: <HomeIcon color="secondary" /> },
    {
        label: 'Companies',
        path: 'companies',
        selectedIndex: 7,
        icon: <BusinessIcon color="secondary" />,
    },
];

export const requestNav: INav[] = [
    {
        label: 'Trade',
        path: 'request/trade',
        selectedIndex: 8,
        icon: <SwapHorizIcon color="secondary" />,
    },
    {
        label: 'Leave',
        path: 'request/leave',
        selectedIndex: 9,
        icon: <FlightIcon color="secondary" />,
    },
    {
        label: 'Sick',
        path: 'request/sick',
        selectedIndex: 10,
        icon: <SickIcon color="secondary" />,
    },
];
