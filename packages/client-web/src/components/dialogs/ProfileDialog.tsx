import React from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import {
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Button,
} from '@mui/material';

interface IProfileDialogProps {
	open: boolean;
	onClose: () => void;
}

const ProfileDialog: React.FC<IProfileDialogProps> = ({ open, onClose }) => {
	const company = useTypedSelector((state) => state.company);
	const user = useTypedSelector((state) => state.user);

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>
				{user.firstName} {user.lastName}
			</DialogTitle>
			<DialogContent>
				<Box sx={{ display: 'flex', flexDirection: 'column' }}>
					<Typography variant="body1">{company.name}</Typography>
					<Typography variant="body1">{user.role}</Typography>
					<Typography variant="body1">{user.email}</Typography>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button color="primary" onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ProfileDialog;
