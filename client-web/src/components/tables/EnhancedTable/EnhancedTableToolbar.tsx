import React from 'react';

import { Toolbar, Typography, Tooltip, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface IEnhancedTableToolbarProps {
	numSelected: number;
	title: string;
	onAdd: () => void;
}

const EnhancedTableToolbar: React.FC<IEnhancedTableToolbarProps> = ({
	numSelected,
	title,
	onAdd
}) => {
	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: theme =>
						alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
				})
			}}
		>
			{numSelected > 0 ? (
				<Typography
					sx={{ flex: '1 1 100%' }}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			) : (
				<Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
					{title}
				</Typography>
			)}
			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton size="large">
						<DeleteIcon color="primary" fontSize="large" />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Add">
					<IconButton onClick={onAdd} size="large">
						<AddCircleIcon color="primary" fontSize="large" />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
};

export default EnhancedTableToolbar;
