const selectedNav: any = {
	'/portal/home': 0,
	'/portal/callouts': 1,
	'/portal/staff': 2,
	'/portal/teams': 3,
	//'/portal/shift-templates': 4,
	'/portal/users': 5,
	'/portal/settings': 6,
};

export const getSelectedNavTab = (pageName: string) => selectedNav[pageName];
