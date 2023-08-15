import React, { useEffect, useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	Box,
	AppBar,
	Toolbar,
	Tooltip,
	IconButton,
	Typography,
	Avatar,
	Drawer,
} from '@mui/material';
import { theme } from 'theme';

import { getSelectedNavTab } from 'utils/navigation/nav-helper';

import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

interface NavSelectProps {
	title: string;
	selected: boolean;
	onNavClick: () => void;
}

const NavSelect: React.FC<NavSelectProps> = ({ title, selected, onNavClick }) => {
	return (
		<>
			{selected ? (
				<Box
					sx={{
						width: '100%',
						height: '75px',
						backgroundColor: theme.palette.secondary.main,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					onClick={onNavClick}
				>
					<Typography variant="h2" color="primary" fontWeight="bold">
						{title}
					</Typography>
				</Box>
			) : (
				<Box
					sx={{
						width: '100%',
						height: '75px',
						backgroundColor: theme.palette.primary.main,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					onClick={onNavClick}
				>
					<Typography variant="h2" color="white">
						{title}
					</Typography>
				</Box>
			)}
		</>
	);
};

interface NavigationMobileProps {
	onLogoutPressed: () => void;
	onProfilePressed: () => void;
}

const NavigationMobile: React.FC<NavigationMobileProps> = ({
	onLogoutPressed,
	onProfilePressed,
}) => {
	const [openDrawer, setOpenDrawer] = useState<boolean>(false);
	const [navSelected, setNavSelected] = useState<number>(0);
	const company = useTypedSelector((state) => state.company);

	const user = useTypedSelector((state) => state.user);

	const location = useLocation();
	const navigate = useNavigate();

	const handleNav = (path: string) => {
		setOpenDrawer(false);
		navigate(`./${path}`);
	};

	const toggleDrawer = () => {
		setOpenDrawer(true);
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
							<IconButton onClick={toggleDrawer}>
								<MenuIcon color="secondary" fontSize="large" />
							</IconButton>
						</Box>
					)}

					<Tooltip title="Logout">
						<IconButton size="large" color="secondary" onClick={onLogoutPressed}>
							<LogoutIcon fontSize="inherit" color="secondary" />
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>
			<Drawer anchor="top" open={openDrawer} onClose={() => setOpenDrawer(false)}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
					<NavSelect
						title="Callouts"
						selected={navSelected === 1}
						onNavClick={() => handleNav('callouts')}
					/>
					<NavSelect
						title="Staff List"
						selected={navSelected === 2}
						onNavClick={() => handleNav('staff')}
					/>
					<NavSelect
						title="Teams"
						selected={navSelected === 3}
						onNavClick={() => handleNav('teams')}
					/>
					{/* <NavSelect
						title="Shift Templates"
						selected={navSelected === 4}
						onNavClick={() => handleNav('shift-templates')}
					/> */}
					<NavSelect
						title="Users"
						selected={navSelected === 5}
						onNavClick={() => handleNav('users')}
					/>
					<NavSelect
						title="Settings"
						selected={navSelected === 6}
						onNavClick={() => handleNav('settings')}
					/>
				</Box>
			</Drawer>
		</Box>
	);
};

export default NavigationMobile;
