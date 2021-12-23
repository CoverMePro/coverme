import React from 'react';

import { Toolbar, Typography, Tooltip, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface IEnhancedTableToolbarProps {
	selected: any;
	title: string;
	onAdd: () => void;
	onDelete: () => void;
}

const EnhancedTableToolbar: React.FC<IEnhancedTableToolbarProps> = ({
	selected,
	title,
	onAdd,
	onDelete
}) => {
	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(selected !== undefined && {
					bgcolor: theme =>
						alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
				})
			}}
		>
			{selected !== undefined ? (
				<Typography
					sx={{ flex: '1 1 100%' }}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{selected} selected
				</Typography>
			) : (
				<Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
					{title}
				</Typography>
			)}
			{selected !== undefined ? (
				<Tooltip title="Delete">
					<IconButton onClick={onDelete} size="large">
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
