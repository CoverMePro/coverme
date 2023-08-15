import React from 'react';
import { Box, Typography } from '@mui/material';
import logo from 'images/cover-me-logo.png';

interface IFormCardProps {
	xs?: string;
	s?: number;
	md?: number;
	title: string;
}

const FormCard: React.FC<IFormCardProps> = ({
	xs = '100%',
	s = 300,
	md = 500,
	title,
	children,
}) => {
	return (
		<Box
			sx={{
				width: '100%',
				borderRadius: 5,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				textAlign: 'center',
			}}
		>
			<Box
				sx={{
					paddingY: 5,
					width: '80%',
				}}
			>
				<img src={logo} width={100} alt="Cover Me Logo" />
				<Typography sx={{ mb: 2 }} variant="h2">
					{title}
				</Typography>
				{children}
			</Box>
		</Box>
	);
};

export default FormCard;
