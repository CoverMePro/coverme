import React, { useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	CircularProgress,
	Typography,
	InputAdornment,
	IconButton,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from 'utils/api';

interface IForgotPasswordProps {
	open: boolean;
	onClose: () => void;
}

const SetPasswordDialog: React.FC<IForgotPasswordProps> = ({ open, onClose }) => {
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const user = useTypedSelector((state) => state.user);

	const { enqueueSnackbar } = useSnackbar();

	const handleSendPasswordReset = () => {
		if (password.length < 4) {
			setError('Password must be greater than 4 characters');
		} else {
			setError(undefined);
			setIsLoading(true);
			api.post(`auth/set-password`, {
				userId: user.id,
				password: password,
			})
				.then(() => {
					enqueueSnackbar('New Password Set! Use new password from now on.', {
						variant: 'success',
						autoHideDuration: 3000,
					});
					setPassword('');
					onClose();
				})
				.catch((err) => {
					console.error(err);
					enqueueSnackbar(
						'An issue occured when setting new password, please try again',
						{
							variant: 'error',
							autoHideDuration: 3000,
						}
					);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	return (
		<Dialog open={open}>
			<DialogTitle>Set Your Password</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ mb: 2 }}>
					<Typography>
						Welcome! This is your first time logging into your Cover Me account. It is
						now time to enter in your own personal password.
					</Typography>
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="password"
					label="Password"
					type={showPassword ? 'text' : 'password'}
					value={password}
					error={error !== undefined}
					helperText={error}
					onChange={(e) => setPassword(e.target.value)}
					fullWidth
					variant="outlined"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<IconButton
									sx={{ padding: 0 }}
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<VisibilityOff color="primary" />
									) : (
										<Visibility color="primary" />
									)}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				<Typography>Make sure it is more than 4 characters.</Typography>
			</DialogContent>
			<DialogActions>
				{isLoading ? (
					<CircularProgress size="2rem" sx={{ mr: 4, mb: 1 }} />
				) : (
					<>
						<Button onClick={handleSendPasswordReset}>Confirm</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default SetPasswordDialog;
