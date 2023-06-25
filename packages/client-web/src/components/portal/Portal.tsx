import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router';

import { theme } from 'theme';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import MainSection from './MainSection';
import Navigation from 'components/navigation/Navigation';
import NavigationMobile from 'components/navigation/NavigationMobile';
import BasicConfirmation from 'components/dialogs/BasicConfirmation';
import ProfileDialog from 'components/dialogs/ProfileDialog';

import api from 'utils/api';

const Dashboard: React.FC = () => {
	const [openLogout, setOpenLogout] = useState<boolean>(false);
	const [loadingLogout, setLoadingLogout] = useState<boolean>(false);
	const [openProfile, setOpenProfile] = useState<boolean>(false);
	const isAboveSmallScreenSize = useMediaQuery(theme.breakpoints.up('sm'));

	const navigate = useNavigate();

	const handleLogout = () => {
		setLoadingLogout(true);
		api.get(`auth/logout`)
			.then(() => {
				setLoadingLogout(false);
				navigate('/login');
			})
			.catch((err) => {
				setLoadingLogout(false);
				console.error(err);
			});
	};

	return (
		<Box>
			{isAboveSmallScreenSize ? (
				<Navigation
					onLogoutPressed={() => setOpenLogout(true)}
					onProfilePressed={() => setOpenProfile(true)}
				/>
			) : (
				<NavigationMobile
					onLogoutPressed={() => setOpenLogout(true)}
					onProfilePressed={() => setOpenProfile(true)}
				/>
			)}
			<MainSection>
				<Outlet />
			</MainSection>
			<BasicConfirmation
				open={openLogout}
				onClose={() => setOpenLogout(false)}
				title="Logout"
				message="Do you want to logout?"
				isLoading={loadingLogout}
				buttons={[
					{ text: 'Yes', color: 'primary', onClick: handleLogout },
					{ text: 'No', color: 'primary', onClick: () => setOpenLogout(false) },
				]}
			/>
			<ProfileDialog open={openProfile} onClose={() => setOpenProfile(false)} />
		</Box>
	);
};

export default Dashboard;
