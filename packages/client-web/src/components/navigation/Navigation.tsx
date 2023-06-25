import React, { useEffect, useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Tooltip, IconButton, Avatar } from '@mui/material';

import { getSelectedNavTab } from 'utils/navigation/nav-helper';

import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import GroupsIcon from '@mui/icons-material/Groups';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NavIcon from './NavIcon';

interface NavigationProps {
	onLogoutPressed: () => void;
	onProfilePressed: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLogoutPressed, onProfilePressed }) => {
	const [navSelected, setNavSelected] = useState<number>(0);
	const company = useTypedSelector((state) => state.company);

	const user = useTypedSelector((state) => state.user);

	const location = useLocation();
	const navigate = useNavigate();

	const handleNav = (path: string) => {
		navigate(`./${path}`);
	};

	useEffect(() => {
		setNavSelected(getSelectedNavTab(location.pathname));
	}, [location.pathname]);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Box sx={{ flexGrow: 1, display: 'flex', gap: '1rem' }}>
						<Tooltip title={`${user.firstName} ${user.lastName} - ${company.name}`}>
							<Avatar
								sx={{
									bgcolor: '#83c5be',
									color: '#006d77',
									cursor: 'pointer',
								}}
								onClick={onProfilePressed}
							>
								{user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}
							</Avatar>
						</Tooltip>
					</Box>
					{navSelected !== 0 && (
						<Box sx={{ flexGrow: 1, display: 'flex', gap: '1.5rem' }}>
							<NavIcon
								icon={<ScheduleSendIcon fontSize="inherit" color="secondary" />}
								title="Callouts"
								onNavClick={() => handleNav('callouts')}
								selected={navSelected === 1}
							/>
							<NavIcon
								icon={<AssignmentIndIcon fontSize="inherit" color="secondary" />}
								title="Staff List"
								onNavClick={() => handleNav('staff')}
								selected={navSelected === 2}
							/>
							<NavIcon
								icon={<GroupWorkIcon fontSize="inherit" color="secondary" />}
								title="Teams"
								onNavClick={() => handleNav('teams')}
								selected={navSelected === 3}
							/>
							<NavIcon
								icon={<PendingActionsIcon fontSize="inherit" color="secondary" />}
								title="Shift Templates"
								onNavClick={() => handleNav('shift-templates')}
								selected={navSelected === 4}
							/>
							<NavIcon
								icon={<GroupsIcon fontSize="inherit" color="secondary" />}
								title="Users"
								onNavClick={() => handleNav('users')}
								selected={navSelected === 5}
							/>
							<NavIcon
								icon={<SettingsIcon fontSize="inherit" color="secondary" />}
								title="Settings"
								onNavClick={() => handleNav('settings')}
								selected={navSelected === 6}
							/>
						</Box>
					)}

					<Tooltip title="Logout">
						<IconButton size="large" color="secondary" onClick={onLogoutPressed}>
							<LogoutIcon fontSize="inherit" color="secondary" />
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default Navigation;
