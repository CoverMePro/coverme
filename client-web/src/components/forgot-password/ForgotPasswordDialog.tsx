import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import { isEmail } from 'utils/validation';

import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	InputAdornment,
	CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

import axios from 'utils/axios-intance';

interface IForgotPasswordProps {
	open: boolean;
	handleClose: () => void;
}

/**
 * A simple dialog component to initate the password reset process
 */

const ForgotPasswordDialog: React.FC<IForgotPasswordProps> = ({ open, handleClose }) => {
	const [email, setEmail] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();
	const [error, setError] = useState<string | undefined>(undefined);

	const handleSendPasswordReset = () => {
		if (!isEmail(email)) {
			setError('Must be an email address');
		} else {
			setError(undefined);
			setIsLoading(true);
			axios
				.post(`${process.env.REACT_APP_SERVER_API}/auth/reset-password`, {
					email: email
				})
				.then(() => {
					enqueueSnackbar('Password Reset Email Sent', {
						variant: 'success',
						autoHideDuration: 3000
					});
					handleClose();
				})
				.catch(err => {
					enqueueSnackbar('An issue occured when sending email, please try again', {
						variant: 'error',
						autoHideDuration: 3000
					});
					console.log(err);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	return (
		<Dialog open={open} onClose={handleClose}>
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
					onChange={e => setEmail(e.target.value)}
					fullWidth
					variant="outlined"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<EmailIcon color="primary" />
							</InputAdornment>
						)
					}}
				/>
			</DialogContent>
			<DialogActions>
				{isLoading ? (
					<CircularProgress size="2rem" sx={{ mr: 4, mb: 1 }} />
				) : (
					<>
						<Button color="error" onClick={handleClose}>
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
