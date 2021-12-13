import React, { useState } from 'react';
import { useFormik } from 'formik';

import {
	Paper,
	Box,
	TextField,
	Fab,
	Stepper,
	Step,
	StepLabel,
	CircularProgress,
	Typography,
	Button
} from '@mui/material';
import MuiPhoneNumber from 'material-ui-phone-number';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { ICompanyFormInfo } from 'models/Validation';
import { validateCompany, validateOwner } from 'utils/validation';

import logo from '../../../images/cover-me-logo.png';
import axios from 'axios';

const steps = ['Company Info', 'Owner Info'];

const CreateCompanyForm: React.FC = () => {
	const [company, setCompany] = useState<ICompanyFormInfo>({
		companyName: '',
		companyEmail: '',
		companyPhone: ''
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const [step, setStep] = useState<number>(0);

	const companyFormik = useFormik({
		initialValues: {
			companyName: '',
			companyEmail: '',
			companyPhone: ''
		},
		validate: validateCompany,
		onSubmit: ({ companyName, companyEmail, companyPhone }) => {
			setIsLoading(true);
			setError(undefined);

			axios
				.get(`${process.env.REACT_APP_SERVER_API}/company/check/${companyName}`)
				.then(result => {
					setIsLoading(false);
					if (result.data.exists === false) {
						setCompany({
							companyName,
							companyEmail,
							companyPhone
						});
						setStep(1);
					} else {
						setError('A company with that name already exists.');
					}
				})
				.catch(err => {
					console.log(err);
					setIsLoading(false);
				});
		}
	});

	const ownerFormik = useFormik({
		initialValues: {
			ownerFirstName: '',
			ownerLastName: '',
			ownerEmail: ''
		},
		validate: validateOwner,
		onSubmit: ({ ownerFirstName, ownerLastName, ownerEmail }) => {
			// Put all necessary info into an object (company and user who owns the company)
			const companyData = {
				company: {
					name: company.companyName,
					data: {
						email: company.companyEmail,
						phone: company.companyPhone
					}
				},
				owner: {
					email: ownerEmail,
					data: {
						firstName: ownerFirstName,
						lastName: ownerLastName,
						role: 'manager',
						company: company.companyName,
						isOwner: true
					}
				}
			};

			setIsLoading(true);

			// TO DO: Error handling
			axios
				.post(`${process.env.REACT_APP_SERVER_API}/auth/create-company`, companyData)
				.then(result => {
					console.log(result);
					setIsLoading(false);
					setStep(2);
				})
				.catch(err => {
					console.log(err);
					setIsLoading(false);
				});
		}
	});

	return (
		<Paper
			sx={{
				width: { xs: '80%', s: 300, md: 500 },
				borderRadius: 5,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center'
			}}
		>
			<Box
				sx={{
					paddingY: 5,
					width: '80%'
				}}
			>
				<Box sx={{ textAlign: 'center' }}>
					<img src={logo} width={100} alt="Cover Me Logo" />
					<Typography variant="h2">Create a Company!</Typography>
				</Box>
				<Stepper sx={{ my: 2 }} activeStep={step}>
					{steps.map((label, index) => {
						const stepProps: { completed?: boolean } = {};
						const labelProps: {
							optional?: React.ReactNode;
						} = {};
						return (
							<Step key={label} {...stepProps}>
								<StepLabel {...labelProps}>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
				{error && (
					<Box sx={{ textAlign: 'center', mb: 2 }}>
						<Typography sx={{ color: 'error.main' }} variant="body1">
							{error}
						</Typography>
					</Box>
				)}
				{step === 0 && (
					<form onSubmit={companyFormik.handleSubmit}>
						<Box>
							<TextField
								sx={{ width: '100%' }}
								variant="outlined"
								type="text"
								label="Company Name"
								name="companyName"
								onChange={companyFormik.handleChange}
								onBlur={companyFormik.handleBlur}
								error={
									companyFormik.touched.companyName &&
									companyFormik.errors.companyName !== undefined &&
									companyFormik.errors.companyName !== ''
								}
								helperText={
									companyFormik.touched.companyName
										? companyFormik.errors.companyName
										: ''
								}
							/>
						</Box>
						<Box sx={{ mt: 2 }}>
							<TextField
								sx={{ width: '100%' }}
								variant="outlined"
								type="email"
								label="Contact Email"
								name="companyEmail"
								onChange={companyFormik.handleChange}
								onBlur={companyFormik.handleBlur}
								error={
									companyFormik.touched.companyEmail &&
									companyFormik.errors.companyEmail !== undefined &&
									companyFormik.errors.companyEmail !== ''
								}
								helperText={
									companyFormik.touched.companyEmail
										? companyFormik.errors.companyEmail
										: ''
								}
							/>
						</Box>
						<Box sx={{ mt: 2 }}>
							<MuiPhoneNumber
								sx={{ width: '100%' }}
								variant="outlined"
								type="text"
								defaultCountry={'ca'}
								disableDropdown
								label="Phone Number"
								name="companyPhone"
								onChange={e => {
									companyFormik.setValues({
										...companyFormik.values,
										companyPhone: e as string
									});
									companyFormik.validateForm();
								}}
								onBlur={companyFormik.handleBlur}
								error={
									companyFormik.touched.companyPhone &&
									companyFormik.errors.companyPhone !== undefined &&
									companyFormik.errors.companyPhone !== ''
								}
								helperText={
									companyFormik.touched.companyPhone
										? companyFormik.errors.companyPhone
										: ''
								}
							/>
						</Box>
						{isLoading ? (
							<Box sx={{ mt: 3, textAlign: 'center' }}>
								<CircularProgress />
							</Box>
						) : (
							<Box sx={{ mt: 3, textAlign: 'center' }}>
								<Fab color="primary" type="submit">
									<ArrowForwardIcon fontSize="large" />
								</Fab>
							</Box>
						)}
					</form>
				)}
				{step === 1 && (
					<form onSubmit={ownerFormik.handleSubmit}>
						<Box>
							<TextField
								sx={{ width: '100%' }}
								variant="outlined"
								type="email"
								label="Email"
								name="ownerEmail"
								onChange={ownerFormik.handleChange}
								onBlur={ownerFormik.handleBlur}
								error={
									ownerFormik.touched.ownerEmail &&
									ownerFormik.errors.ownerEmail !== undefined &&
									ownerFormik.errors.ownerEmail !== ''
								}
								helperText={
									ownerFormik.touched.ownerEmail
										? ownerFormik.errors.ownerEmail
										: ''
								}
							/>
						</Box>
						<Box sx={{ mt: 2 }}>
							<TextField
								sx={{ width: '100%' }}
								variant="outlined"
								type="text"
								label="First Name"
								name="ownerFirstName"
								onChange={ownerFormik.handleChange}
								onBlur={ownerFormik.handleBlur}
								error={
									ownerFormik.touched.ownerFirstName &&
									ownerFormik.errors.ownerFirstName !== undefined &&
									ownerFormik.errors.ownerFirstName !== ''
								}
								helperText={
									ownerFormik.touched.ownerFirstName
										? ownerFormik.errors.ownerFirstName
										: ''
								}
							/>
						</Box>
						<Box sx={{ mt: 2 }}>
							<TextField
								sx={{ width: '100%' }}
								variant="outlined"
								type="text"
								label="Last Name"
								name="ownerLastName"
								onChange={ownerFormik.handleChange}
								onBlur={ownerFormik.handleBlur}
								error={
									ownerFormik.touched.ownerLastName &&
									ownerFormik.errors.ownerLastName !== undefined &&
									ownerFormik.errors.ownerLastName !== ''
								}
								helperText={
									ownerFormik.touched.ownerLastName
										? ownerFormik.errors.ownerLastName
										: ''
								}
							/>
						</Box>

						{isLoading ? (
							<Box sx={{ mt: 3, textAlign: 'center' }}>
								<CircularProgress />
							</Box>
						) : (
							<Box sx={{ mt: 3, textAlign: 'center' }}>
								<Fab color="primary" type="submit">
									<ArrowForwardIcon fontSize="large" />
								</Fab>
							</Box>
						)}
					</form>
				)}
				{step === 2 && (
					<Box sx={{ textAlign: 'center' }}>
						<Typography></Typography>
						<h3>Company Created!</h3>
						<p>An email was sent to the company owner to complete their registration</p>
						<Button variant="contained" onClick={() => setStep(0)}>
							Create Another
						</Button>
					</Box>
				)}
			</Box>
		</Paper>
	);
};

export default CreateCompanyForm;
