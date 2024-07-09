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
	CircularProgress,
} from '@mui/material';
import ForgotPasswordDialog from 'components/dialogs/ForgotPasswordDialog';

import { IUser, ICompany } from 'coverme-shared';

import { validateLogin } from 'utils/validations/auth';
import api from 'utils/api';
import { AxiosError } from 'axios';

import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

import loginBackground from '../../images/login-background.jpg';
import logo from '../../images/cover-me-logo.png';
import SetPasswordDialog from 'components/dialogs/SetPasswordDialog';

const LoginView: React.FC = () => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isLogginIn, setIsLoggingIn] = useState<boolean>(false);
	const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
	const [openForgotPassword, setOpenForgotPassword] = useState<boolean>(false);
	const [openSetPassword, setOpenSetPassword] = useState<boolean>(false);
	const [loginError, setLoginError] = useState<string | undefined>(undefined);

	const navigate = useNavigate();
	const { setUser, setCompany } = useActions();

	const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate: validateLogin,
		onSubmit: (loginValues: any) => {
			const { email, password } = loginValues;
			setIsLoggingIn(true);
			setLoginError(undefined);

			api.authLogin(email, password)
				.then((result) => {
					const userData: IUser = result.userInfo;
					const companyData: ICompany = result.companyInfo;
					setUser(userData);
					setCompany(companyData);
					setIsLoggingIn(false);
					if (userData.status === 'Pending') {
						setOpenSetPassword(true);
					} else {
						navigate('/portal/home');
					}
				})
				.catch((err: AxiosError) => {
					setIsLoggingIn(false);
					if (err.response?.status === 403) {
						setLoginError('Your email or password was incorrect.');
					} else {
						setLoginError('An unknow error has occured, please try again.');
					}
				});
		},
	});

	const handleNewPasswordSet = () => {
		setOpenSetPassword(false);
		navigate('/portal/home');
	};

	useEffect(() => {
		api.authCheck()
			.then((userResult) => {
				setUser(userResult.userInfo);
				setCompany(userResult.companyInfo);
				navigate('/portal');
			})
			.catch((err) => {
				console.error(err);
				setIsCheckingAuth(false);
			});
	}, [navigate, setUser, setCompany]);

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
					alignItems: 'center',
				}}
			>
				<Paper
					sx={{
						width: { xs: '90%', sm: 400 },
						borderRadius: 5,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						textAlign: 'center',
						marginTop: { xs: '2rem', md: 0 },
					}}
				>
					<Box
						sx={{
							paddingY: 5,
							width: '80%',
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
												),
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
												),
											}}
										/>
									</Box>
									<Box
										sx={{
											mb: 2,
											display: 'flex',
											justifyContent: 'end',
										}}
									>
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
				onClose={() => setOpenForgotPassword(false)}
			/>
			<SetPasswordDialog open={openSetPassword} onClose={handleNewPasswordSet} />
		</>
	);
};

export default LoginView;
