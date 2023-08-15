import React from 'react';
import { Box, Grid } from '@mui/material';

import NavCard from 'components/navigation/NavCard';

// Nav Icons
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import GroupsIcon from '@mui/icons-material/Groups';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SettingsIcon from '@mui/icons-material/Settings';

const HomeView: React.FC = () => {
	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Grid container spacing={4} sx={{ height: '100%' }} justifyContent="center">
				<NavCard
					icon={<ScheduleSendIcon fontSize="inherit" color="secondary" />}
					title="Callouts"
					path="callouts"
				/>
				<NavCard
					icon={<AssignmentIndIcon fontSize="inherit" color="secondary" />}
					title="Staff List"
					path="staff"
				/>
				<NavCard
					icon={<GroupWorkIcon fontSize="inherit" color="secondary" />}
					title="Teams"
					path="teams"
				/>
				{/* <NavCard
					icon={<PendingActionsIcon fontSize="inherit" color="secondary" />}
					title="Shift Templates"
					path="shift-templates"
				/> */}
				<NavCard
					icon={<GroupsIcon fontSize="inherit" color="secondary" />}
					title="Users"
					path="users"
				/>
				<NavCard
					icon={<SettingsIcon fontSize="inherit" color="secondary" />}
					title="Settings"
					path="settings"
				/>
			</Grid>
		</Box>
	);
};

export default HomeView;
