import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { theme } from 'theme';

interface NavCardProps {
	icon: any;
	title: string;
	path: string;
}

const NavCard: React.FC<NavCardProps> = ({ icon, title, path }) => {
	const navigate = useNavigate();

	const handleNav = () => {
		navigate(`../${path}`);
	};

	return (
		<Grid
			item
			xs={12}
			sm={6}
			md={6}
			lg={4}
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Box
				sx={{
					height: { xs: '75px', xl: '400px', lg: '300px', sm: '300px' },
					width: { xs: '90%', xl: '400px', lg: '300px', sm: '300px' },
					backgroundColor: theme.palette.primary.main,
					borderRadius: { xs: '10px', sm: '10%' },
					cursor: 'pointer',
					boxShadow: '0 3px 0 grey;',
					':hover': {
						backgroundColor: theme.palette.primary.dark,
					},
				}}
				onClick={handleNav}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'row', sm: 'column' },
						justifyContent: { xs: 'start', sm: 'center' },
						alignItems: 'center',
						height: '100%',
						width: '100%',
						gap: '2rem',
					}}
				>
					<Box
						sx={{
							height: { sm: '50%' },
							width: { sm: '50%' },
							fontSize: { xs: 48, sm: 120 },
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							paddingLeft: { xs: '1rem', sm: '0' },
						}}
					>
						{icon}
					</Box>
					<Typography
						variant="h1"
						color="white"
						sx={{ fontSize: { xs: '24px', sm: '38px' } }}
					>
						{title}
					</Typography>
				</Box>
			</Box>
		</Grid>
	);
};

export default NavCard;
