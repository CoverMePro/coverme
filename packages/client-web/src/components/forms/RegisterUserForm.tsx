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
import UpdateIcon from '@mui/icons-material/ArrowCircleUpRounded';

import FormCard from './FormCard';
import { validateUserCreate, validateUserEdit } from 'utils/validations/user';

import api from 'utils/api';

interface IRegisterUserFormProps {
	editMode: boolean;
	selectedUser: any;
	onFinish: () => void;
}

const RegisterUserForm: React.FC<IRegisterUserFormProps> = ({
	editMode,
	selectedUser,
	onFinish,
}) => {
	const [role, setRole] = useState<string>(editMode ? selectedUser.role : 'Manager');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isTestUser, setIsTestUser] = useState<boolean>(false);

	const { enqueueSnackbar } = useSnackbar();

	const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRole((event.target as HTMLInputElement).value);
	};

	const { handleSubmit, handleChange, handleBlur, setValues, values, touched, errors } =
		useFormik({
			initialValues: {
				firstName: editMode ? selectedUser.firstName : '',
				lastName: editMode ? selectedUser.lastName : '',
				email: editMode ? selectedUser.email : '',
				phone: editMode ? selectedUser.phone : '',
				password: '',
			},
			validate: editMode ? validateUserEdit : validateUserCreate,
			onSubmit: (userValues: any) => {
				const { email, firstName, lastName, password, phone } = userValues;
				setIsLoading(true);

				if (editMode) {
					api.post(`users/${selectedUser.id}`, {
						email,
						firstName,
						lastName,
						role: role,
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
				}
			},
		});

	const handleChangeTestUser = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		setIsTestUser(checked);
	};

	return (
		<FormCard title={editMode ? 'Edit User' : 'Register a User'}>
			{!editMode && (
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Typography variant="body1">Test User</Typography>
					<Checkbox value={isTestUser} onChange={handleChangeTestUser} />
				</Box>
			)}

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
						value={values.firstName}
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
						value={values.lastName}
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
						value={values.email}
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
						<Fab color="primary" aria-label={'Register Staff Member'} type="submit">
							{editMode ? (
								<UpdateIcon fontSize="large" />
							) : (
								<HowToRegIcon fontSize="large" />
							)}
						</Fab>
					)}
				</Box>
			</form>
		</FormCard>
	);
};

export default RegisterUserForm;
