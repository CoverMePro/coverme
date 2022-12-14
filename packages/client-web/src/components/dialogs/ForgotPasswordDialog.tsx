import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	InputAdornment,
	CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

import { isEmail } from 'utils/validations/shared';
import api from 'utils/api';

interface IForgotPasswordProps {
	open: boolean;
	onClose: () => void;
}

const ForgotPasswordDialog: React.FC<IForgotPasswordProps> = ({ open, onClose }) => {
	const [email, setEmail] = useState<string>('');
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { enqueueSnackbar } = useSnackbar();

	const handleSendPasswordReset = () => {
		if (!isEmail(email)) {
			setError('Must be an email address');
		} else {
			setError(undefined);
			setIsLoading(true);
			api.post(`auth/reset-password`, {
				email: email,
			})
				.then(() => {
					enqueueSnackbar('Password Reset Email Sent', {
						variant: 'success',
						autoHideDuration: 3000,
					});
					setEmail('');
					onClose();
				})
				.catch((err) => {
					console.error(err);
					enqueueSnackbar('An issue occured when sending email, please try again', {
						variant: 'error',
						autoHideDuration: 3000,
					});
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Forgot Password</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Enter your email address. If it is valid, you will receive an email with a link
					to reset your password!
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					type="email"
					value={email}
					error={error !== undefined}
					helperText={error}
					onChange={(e) => setEmail(e.target.value)}
					fullWidth
					variant="outlined"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<EmailIcon color="primary" />
							</InputAdornment>
						),
					}}
				/>
			</DialogContent>
			<DialogActions>
				{isLoading ? (
					<CircularProgress size="2rem" sx={{ mr: 4, mb: 1 }} />
				) : (
					<>
						<Button color="error" onClick={onClose}>
							Cancel
						</Button>
						<Button onClick={handleSendPasswordReset}>Send</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default ForgotPasswordDialog;
