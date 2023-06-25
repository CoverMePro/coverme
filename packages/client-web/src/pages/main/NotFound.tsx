import React from 'react';
import { Box, Typography } from '@mui/material';

import logo from 'images/cover-me-logo.png';

const NotFound: React.FC = () => {
	return (
		<Box
			sx={{
				height: '100vh',
				width: '100vw',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				gap: '2rem',
			}}
		>
			<img src={logo} alt="Cover Me Logo" />
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<Typography variant="h1">Sorry!</Typography>
				<Typography variant="h2">This page does not exist</Typography>
				<Typography variant="body1">Error Code: 404</Typography>
			</Box>
		</Box>
	);
};

export default NotFound;
