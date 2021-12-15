import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';

import { useActions } from 'hooks/use-actions';

import {
	Box,
	Button,
	Typography,
	TextField,
	IconButton,
	Fab,
	InputAdornment,
	Paper,
	CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

import loginBackground from '../../images/login-background.jpg';
import logo from '../../images/cover-me-logo.png';

import { validateLogin } from 'utils/validation';
import axios from 'axios';
import ForgotPasswordDialog from 'components/forgot-password/ForgotPasswordDialog';

const Login: React.FC = () => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isLogginIn, setIsLoggingIn] = useState<boolean>(false);
	const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
	const [openForgotPassword, setOpenForgotPassword] = useState<boolean>(false);
	const [loginError, setLoginError] = useState<string | undefined>(undefined);
	const navigate = useNavigate();

	const { setUser } = useActions();

	const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
		initialValues: {
			email: '',
			password: ''
		},
		validate: validateLogin,
		onSubmit: (loginValues: any) => {
			const { email, password } = loginValues;
			setIsLoggingIn(true);
			setLoginError(undefined);

			axios
				.post(
					`${process.env.REACT_APP_SERVER_API}/auth/signin`,
					{
						email,
						password
					},
					{ withCredentials: true }
				)
				.then(result => {
					console.log(result);
					setIsLoggingIn(false);

					setUser({ ...result.data.user.data, email: result.data.user.email });

					navigate('/dashboard');
				})
				.catch(err => {
					// TODO: Handle multiple error codes
					setIsLoggingIn(false);
					setLoginError('Your email or password was incorrect.');
					console.log(err);
				});
		}
	});

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_SERVER_API}/auth`, { withCredentials: true })
			.then(result => {
				console.log(result);

				navigate('/dashboard');
			})
			.catch(err => {
				setIsCheckingAuth(false);
			});
	}, []);

	return (
		<>
			<Box
				sx={{
					height: '100vh',
					width: '100vw',
					backgroundImage: `url(${loginBackground})`,
					backgroundSize: 'cover',
					backgroundAttachment: 'fixed',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Paper
					sx={{
						width: { xs: '80%', md: 400 },
						borderRadius: 5,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						textAlign: 'center'
					}}
				>
					<Box
						sx={{
							paddingY: 5,
							width: '80%'
						}}
					>
						<img src={logo} width={100} alt="Cover Me Logo" />
						<Typography variant="h2">Welcome!</Typography>
						{isCheckingAuth ? (
							<Box>
								<CircularProgress />
							</Box>
						) : (
							<Box sx={{ mt: 2 }}>
								{loginError && (
									<Typography sx={{ color: 'error.main' }} variant="body1">
										{loginError}
									</Typography>
								)}
								<form onSubmit={handleSubmit}>
									<Box>
										<TextField
											sx={{ width: '100%' }}
											variant="outlined"
											type="email"
											name="email"
											size="small"
											onChange={handleChange}
											onBlur={handleBlur}
											error={
												touched.email &&
												errors.email !== undefined &&
												errors.email !== ''
											}
											helperText={touched.email ? errors.email : ''}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<EmailIcon color="primary" />
													</InputAdornment>
												)
											}}
										/>
									</Box>
									<Box sx={{ mt: 2 }}>
										<TextField
											sx={{ width: '100%' }}
											variant="outlined"
											type={showPassword ? 'text' : 'password'}
											name="password"
											size="small"
											onChange={handleChange}
											onBlur={handleBlur}
											error={
												touched.password &&
												errors.password !== undefined &&
												errors.password !== ''
											}
											helperText={touched.password ? errors.password : ''}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<IconButton
															sx={{ padding: 0 }}
															onClick={() =>
																setShowPassword(!showPassword)
															}
														>
															{showPassword ? (
																<VisibilityOff color="primary" />
															) : (
																<Visibility color="primary" />
															)}
														</IconButton>
													</InputAdornment>
												)
											}}
										/>
									</Box>
									<Box sx={{ mb: 2, display: 'flex', justifyContent: 'end' }}>
										<Button onClick={() => setOpenForgotPassword(true)}>
											Forgot Password
										</Button>
									</Box>
									{isLogginIn ? (
										<Box>
											<CircularProgress />
										</Box>
									) : (
										<Box>
											<Fab color="primary" type="submit" aria-label="Login">
												<LoginIcon fontSize="large" />
											</Fab>
										</Box>
									)}
								</form>
							</Box>
						)}
					</Box>
				</Paper>
			</Box>
			<ForgotPasswordDialog
				open={openForgotPassword}
				handleClose={() => setOpenForgotPassword(false)}
			/>
		</>
	);
};

export default Login;
