import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import { INav } from 'coverme-shared';

interface INavListProps {
	visible: boolean;
	navSelected: number;
	navItems: INav[];
}

const NavList: React.FC<INavListProps> = ({ visible, navItems, navSelected }) => {
	const navigate = useNavigate();

	const handleNav = (subRoute: string) => {
		navigate(`./${subRoute}`);
	};

	return (
		<>
			{visible && (
				<List disablePadding>
					{navItems.map((nav) => {
						return (
							<ListItem key={nav.label} disablePadding>
								<ListItemButton
									onClick={() => handleNav(nav.path)}
									selected={navSelected === nav.selectedIndex}
								>
									<ListItemIcon>{nav.icon}</ListItemIcon>
									<ListItemText primary={nav.label} />
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>
			)}
		</>
	);
};

export default NavList;
