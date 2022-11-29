const selectedNav: any = {
    '/dashboard/home': 0,
    '/dashboard/calendar': 1,
    '/dashboard/schedule': 2,
    '/dashboard/staff': 3,
    '/dashboard/teams': 4,
    '/dashboard/blog': 5,
    '/dashboard/shifts': 6,
    '/dashboard/companies': 7,
    '/dashboard/request/trade': 8,
    '/dashboard/request/leave': 9,
    '/dashboard/request/sick': 10,
    '/dashboard/overtime/list': 11,
    '/dashboard/overtime/callouts': 12,
    '/dashboard/requests': 13,
};

export const getSelectedNavTab = (pageName: string) => selectedNav[pageName];
