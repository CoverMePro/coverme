const selectedNav: any = {
	'/portal/home': 0,
	'/portal/callouts': 1,
	//'/portal/calendar': 1,
	//'/portal/schedule': 2,
	'/portal/staff': 2,
	'/portal/teams': 3,
	//'/portal/blog': 5,
	//'/portal/shift-templates': 4,
	'/portal/users': 5,
	'/portal/settings': 6,
	//'/portal/companies': 7,
	//'/portal/request/trade': 8,
	//'/portal/request/leave': 9,
	//'/portal/request/sick': 10,
	//'/portal/overtime/list': 11,
	//'/portal/overtime/callouts': 12,
	//'/portal/requests': 13,
};

export const getSelectedNavTab = (pageName: string) => selectedNav[pageName];
