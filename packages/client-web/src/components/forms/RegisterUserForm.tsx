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
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
} from '@mui/material';
import MuiPhoneNumber from 'material-ui-phone-number';
import HowToRegIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/ArrowCircleUpRounded';
import FormCard from './FormCard';
import { validateUserCreate, validateUserEdit } from 'utils/validations/user';
import api from 'utils/api';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
	const [employeeType, setEmployeeType] = useState<string>('Full-Time');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [savedHireDate, setSavedHireDate] = useState<Date>(
		editMode ? selectedUser.hireDate : new Date()
	);

	const [contactBy, setContactBy] = useState<string>('Text');

	const { enqueueSnackbar } = useSnackbar();

	const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRole((event.target as HTMLInputElement).value);
	};

	const handleContactByChange = (event: SelectChangeEvent) => {
		setContactBy(event.target.value as string);
	};

	const handleEmployeeTypeChange = (event: SelectChangeEvent) => {
		setEmployeeType(event.target.value as string);
	};

	const { handleSubmit, handleChange, handleBlur, setValues, values, touched, errors } =
		useFormik({
			initialValues: {
				firstName: editMode ? selectedUser.firstName : '',
				lastName: editMode ? selectedUser.lastName : '',
				email: editMode ? selectedUser.email : '',
				phone: editMode ? selectedUser.phone : '',
				employeeType: editMode ? selectedUser.employeeType : 'Full-Time',
				hireDate: editMode ? selectedUser.hireDate : '',
				contactBy: editMode ? selectedUser.contactBy : 'Text',
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
						employeeType: employeeType,
						hireDate: savedHireDate,
						contactBy: contactBy,
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
					const newUser = {
						email,
						firstName,
						lastName,
						role: role,
						password: password,
						phone: phone,
						employeeType: employeeType,
						hireDate: savedHireDate,
						contactBy: contactBy,
					};

					console.log(newUser);

					api.post(`auth/complete-register`, newUser)
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
				}
			},
		});

	return (
		<FormCard title={editMode ? 'Edit User' : 'Register a User'}>
			{/* {!editMode && (
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Typography variant="body1">Test User</Typography>
					<Checkbox value={isTestUser} onChange={handleChangeTestUser} />
				</Box>
			)} */}

			<form onSubmit={handleSubmit}>
				<Box sx={{ mt: 2 }}>
					<FormControl component="fieldset">
						<RadioGroup
							row
							name="row-radio-buttons-group"
							onChange={handleChangeRole}
							defaultValue="Manager"
						>
							<FormControlLabel value="Manager" control={<Radio />} label="Manager" />
							<FormControlLabel value="Staff" control={<Radio />} label="Staff" />
						</RadioGroup>
					</FormControl>
				</Box>
				<Box sx={{ mt: 2 }}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Employee Type</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							defaultValue={values.employeeType}
							label="Employee Type"
							onChange={handleEmployeeTypeChange}
						>
							<MenuItem value="Full-Time">Full-Time</MenuItem>
							<MenuItem value="Part-Time">Part-Time</MenuItem>
							<MenuItem value="Temp">Temp</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Box sx={{ mt: 2, display: 'flex', gap: '1rem' }}>
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

				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Box sx={{ mt: 2 }}>
						<DatePicker
							renderInput={(props) => (
								<TextField
									{...props}
									fullWidth
									name="hireDate"
									value={values.hireDate}
									onChange={handleChange}
									onBlur={handleBlur}
									error={
										touched.hireDate &&
										errors.hireDate !== undefined &&
										errors.hireDate !== ''
									}
									helperText={touched.hireDate ? errors.hireDate : ''}
								/>
							)}
							InputProps={{ readOnly: true }}
							label="Hire Date"
							value={values.hireDate}
							onChange={(newValue, keyboardValue) => {
								if (newValue && keyboardValue === undefined) {
									setSavedHireDate(newValue);
									setValues({
										...values,
										hireDate: newValue.toDateString(),
									});
								} else if (keyboardValue !== undefined) {
									setValues({
										...values,
										hireDate: values.hireDate.toDateString(),
									});
								}
							}}
						/>
					</Box>
					<>
						<>
							<Box sx={{ mt: 2 }}>
								<MuiPhoneNumber
									defaultCountry={'ca'}
									disableDropdown
									sx={{ mb: 2, width: '40%' }}
									variant="outlined"
									label="Phone Number"
									value={values.phone}
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

								<FormControl fullWidth sx={{ ml: 2, mb: 2, width: '40%' }}>
									<InputLabel id="demo-simple-select-label">
										Contact By
									</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										defaultValue={values.contactBy}
										label="Contact By"
										onChange={handleContactByChange}
									>
										<MenuItem value="Text">Text</MenuItem>
										<MenuItem value="Phone">Phone</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</>
					</>
				</LocalizationProvider>

				<Box sx={{ mt: 2 }}>
					<Typography sx={{ fontWeight: 'bold' }}>
						Set a temporary password for this user to log in once with.
					</Typography>
					<TextField
						sx={{ width: '100%' }}
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

					<Typography sx={{ fontWeight: 'bold' }}>
						They will have option to reset it after.
					</Typography>
				</Box>

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
