import React, { useState } from 'react';

import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

import axios from 'utils/axios-intance';

interface IForgotPasswordProps {
	open: boolean;
	handleClose: () => void;
}

const ForgotPasswordDialog: React.FC<IForgotPasswordProps> = ({ open, handleClose }) => {
	const [email, setEmail] = useState<string>('');

	const handleSendPasswordReset = () => {
		axios
			.post(`${process.env.REACT_APP_SERVER_API}/auth/reset-password`, {
				email: email
			})
			.then(() => {
				// TODO: handle success
				console.log('great success!');
				handleClose();
			})
			.catch(err => {
				// TODO: handle error
				console.log(err);
			});
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
				<Button color="error" onClick={handleClose}>
					Cancel
				</Button>
				<Button onClick={handleSendPasswordReset}>Send</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ForgotPasswordDialog;
