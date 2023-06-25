import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import { theme } from 'theme';

interface NavIconProps {
	icon: any;
	title: string;
	selected: boolean;
	onNavClick: () => void;
}

const NavIcon: React.FC<NavIconProps> = ({ icon, title, selected, onNavClick }) => {
	return (
		<>
			{selected ? (
				<Box
					sx={{
						borderRadius: '50%',
						border: `2px solid ${theme.palette.secondary.main}`,
					}}
				>
					<Tooltip title={title}>
						<IconButton size="large" color="secondary" onClick={onNavClick}>
							{icon}
						</IconButton>
					</Tooltip>
				</Box>
			) : (
				<Tooltip title={title}>
					<IconButton size="large" color="secondary" onClick={onNavClick}>
						{icon}
					</IconButton>
				</Tooltip>
			)}
		</>
	);
};

export default NavIcon;
