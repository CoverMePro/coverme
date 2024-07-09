import React from 'react';
import { Box, Breakpoint, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface IFormDialogProps {
	open: boolean;
	fullScreen?: boolean;
	onClose: () => void;
	maxWidth?: false | Breakpoint | undefined;
}

const FormDialog: React.FC<IFormDialogProps> = ({
	open,
	fullScreen = false,
	onClose,
	children,
	maxWidth = 'xs',
}) => {
	return (
		<Dialog fullWidth maxWidth={maxWidth} open={open} fullScreen={fullScreen}>
			<Box sx={{ position: 'absolute', right: 5, zIndex: 400 }}>
				<IconButton onClick={onClose}>
					<CloseIcon color="primary" fontSize="large" />
				</IconButton>
			</Box>

			{children}
		</Dialog>
	);
};

export default FormDialog;
