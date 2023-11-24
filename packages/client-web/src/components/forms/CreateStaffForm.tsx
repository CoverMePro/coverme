import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import {
	Box,
	TextField,
	Fab,
	FormControl,
	CircularProgress,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MuiPhoneNumber from 'material-ui-phone-number';
import HowToRegIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/ArrowCircleUpRounded';
import FormCard from './FormCard';
import { validateStaffCreate } from 'utils/validations/staff';
import api from 'utils/api';

interface IRegisterUserFormProps {
	onFinish: () => void;
	editMode: boolean;
	selectedUser: any;
}

const CreateStaffForm: React.FC<IRegisterUserFormProps> = ({
	onFinish,
	editMode,
	selectedUser,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [savedHireDate, setSavedHireDate] = useState<Date>(
		editMode ? selectedUser.hireDate : new Date()
	);
	const [employeeType, setEmployeeType] = useState<string>('Full-Time');
	const [contactBy, setContactBy] = useState<string>('Text');

	const { enqueueSnackbar } = useSnackbar();

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
				hireDate: editMode ? selectedUser.hireDate : '',
				phone: editMode ? selectedUser.phone : '',
				employeeType: editMode ? selectedUser.employeeType : 'Full-Time',
				contactBy: editMode ? selectedUser.contactBy : 'Text',
			},
			validate: validateStaffCreate,
			onSubmit: (userValues: any) => {
				const { firstName, lastName, phone } = userValues;
				setIsLoading(true);

				if (editMode) {
					api.post(`staff/${selectedUser.id}`, {
						firstName,
						lastName,
						employeeType: employeeType,
						hireDate: savedHireDate,
						phone: phone,
						contactBy: contactBy,
					})
						.then(() => {
							setIsLoading(false);
							enqueueSnackbar('Success! Updated Staff member', {
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
					api.post(`staff`, {
						firstName,
						lastName,
						employeeType: employeeType,
						hireDate: savedHireDate,
						phone: phone,
						contactBy: contactBy,
					})
						.then(() => {
							setIsLoading(false);
							enqueueSnackbar('Success! Created Staff member', {
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
		<FormCard title={editMode ? ' Edit Staff Member' : ' Register a Staff Member'}>
			<form onSubmit={handleSubmit}>
				<Box>
					<TextField
						sx={{ width: '100%' }}
						variant="outlined"
						type="text"
						name="firstName"
						label="Fist Name"
						value={values.firstName}
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
						value={values.lastName}
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
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Staff Type</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							defaultValue={values.employeeType}
							label="Staff Type"
							onChange={handleEmployeeTypeChange}
						>
							<MenuItem value="Full-Time">Full-Time</MenuItem>
							<MenuItem value="Part-Time">Part-Time</MenuItem>
							<MenuItem value="Temp">Temp</MenuItem>
						</Select>
					</FormControl>
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
							value={savedHireDate}
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
										hireDate: savedHireDate.toDateString(),
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
										value={contactBy}
									>
										<MenuItem value="Text">Text</MenuItem>
										<MenuItem value="Phone">Phone</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</>
					</>
				</LocalizationProvider>

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

export default CreateStaffForm;
