import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import {
	Box,
	TextField,
	Fab,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	CircularProgress,
	Typography,
	Checkbox,
} from '@mui/material';
import MuiPhoneNumber from 'material-ui-phone-number';
import HowToRegIcon from '@mui/icons-material/Add';

import FormCard from './FormCard';
import { validateUserCreate } from 'utils/validations/user';

import api from 'utils/api';

interface IRegisterUserFormProps {
	onFinish: () => void;
}

const RegisterUserForm: React.FC<IRegisterUserFormProps> = ({ onFinish }) => {
	const [role, setRole] = useState<string>('Manager');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isTestUser, setIsTestUser] = useState<boolean>(false);

	const { enqueueSnackbar } = useSnackbar();

	const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRole((event.target as HTMLInputElement).value);
	};

	const { handleSubmit, handleChange, handleBlur, setValues, values, touched, errors } =
		useFormik({
			initialValues: {
				firstName: '',
				lastName: '',
				email: '',
				position: '',
				hireDate: String(new Date()),
				phone: '',
				password: '',
			},
			validate: validateUserCreate,
			onSubmit: (userValues: any) => {
				const { email, firstName, lastName, password, phone } = userValues;
				setIsLoading(true);
				if (isTestUser) {
					api.post(`auth/complete-register`, {
						email,
						firstName,
						lastName,
						role: role,
						password: password,
						phone: phone,
					})
						.then(() => {
							setIsLoading(false);
							enqueueSnackbar('Success! User has been created', {
								variant: 'success',
							});
							onFinish();
						})
						.catch((err) => {
							console.error(err);
							setIsLoading(false);
							enqueueSnackbar('An error has occured, please try again', {
								variant: 'error',
							});
							onFinish();
						});
				} else {
					api.post(`auth/register-link`, {
						email,
						firstName,
						lastName,
						role: role,
					})
						.then(() => {
							setIsLoading(false);
							enqueueSnackbar(
								'Success! an email has been sent out to this user to complete registration.',
								{
									variant: 'success',
								}
							);
							onFinish();
						})
						.catch((err) => {
							console.error(err);
							setIsLoading(false);
							enqueueSnackbar('An error has occured, please try again', {
								variant: 'error',
							});
							onFinish();
						});
				}
			},
		});

	const handleChangeTestUser = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		setIsTestUser(checked);
	};

	return (
		<FormCard title=" Register a User">
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Typography variant="body1">Test User</Typography>
				<Checkbox value={isTestUser} onChange={handleChangeTestUser} />
			</Box>

			<form onSubmit={handleSubmit}>
				<Box>
					<TextField
						sx={{ width: '100%' }}
						variant="outlined"
						type="text"
						name="firstName"
						label="Fist Name"
						onChange={handleChange}
						onBlur={handleBlur}
						error={
							touched.firstName &&
							errors.firstName !== undefined &&
							errors.firstName !== ''
						}
						helperText={touched.firstName ? errors.firstName : ''}
					/>
				</Box>
				<Box sx={{ mt: 2 }}>
					<TextField
						sx={{ width: '100%' }}
						variant="outlined"
						type="text"
						name="lastName"
						label="Last Name"
						onChange={handleChange}
						onBlur={handleBlur}
						error={
							touched.lastName &&
							errors.lastName !== undefined &&
							errors.lastName !== ''
						}
						helperText={touched.lastName ? errors.lastName : ''}
					/>
				</Box>
				<Box sx={{ mt: 2 }}>
					<TextField
						sx={{ width: '100%' }}
						variant="outlined"
						type="email"
						name="email"
						label="Email"
						onChange={handleChange}
						onBlur={handleBlur}
						error={touched.email && errors.email !== undefined && errors.email !== ''}
						helperText={touched.email ? errors.email : ''}
					/>
				</Box>
				<Box sx={{ mt: 2 }}>
					<FormControl component="fieldset">
						<RadioGroup
							row
							name="row-radio-buttons-group"
							onChange={handleChangeRole}
							defaultValue="Manager"
						>
							<FormControlLabel value="Manager" control={<Radio />} label="Manager" />
							<FormControlLabel value="Admin" control={<Radio />} label="Admin" />
						</RadioGroup>
					</FormControl>
				</Box>
				<>
					{isTestUser && (
						<>
							<Box sx={{ mt: 2 }}>
								<TextField
									sx={{ mb: 2, width: '100%' }}
									variant="outlined"
									label="Password"
									type="text"
									name="password"
									onChange={handleChange}
									onBlur={handleBlur}
									error={
										touched.password &&
										errors.password !== undefined &&
										errors.password !== ''
									}
									helperText={touched.password ? errors.password : ''}
								/>
							</Box>
							<Box sx={{ mt: 2 }}>
								<MuiPhoneNumber
									defaultCountry={'ca'}
									disableDropdown
									sx={{ mb: 2, width: '40%' }}
									variant="outlined"
									label="Phone Number"
									type="tel"
									name="phone"
									onChange={(e) => {
										setValues({
											...values,
											phone: e as string,
										});
									}}
									onBlur={handleBlur}
									error={
										touched.phone &&
										errors.phone !== undefined &&
										errors.phone !== ''
									}
									helperText={touched.phone ? errors.phone : ''}
								/>
							</Box>
						</>
					)}
				</>

				<Box sx={{ mt: 3 }}>
					{isLoading ? (
						<CircularProgress />
					) : (
						<Fab color="primary" aria-label="Register User" type="submit">
							<HowToRegIcon fontSize="large" />
						</Fab>
					)}
				</Box>
			</form>
		</FormCard>
	);
};

export default RegisterUserForm;
