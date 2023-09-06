import React, { useState } from 'react';
import { Box, TextField, CircularProgress, Fab, Paper, Typography } from '@mui/material';
import FormCard from 'components/forms/FormCard';
import { useFormik } from 'formik';
import UpdateIcon from '@mui/icons-material/ArrowCircleUpRounded';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useActions } from 'hooks/use-actions';
import api from 'utils/api';
import { validateCompany } from 'utils/validations/company';
import { useSnackbar } from 'notistack';

const SettingsView: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();
	const company = useTypedSelector((state) => state.company);
	const user = useTypedSelector((state) => state.user);
	const { setCompany } = useActions();

	const { handleSubmit, handleChange, handleBlur, values, touched, errors } = useFormik({
		initialValues: {
			companyName: company.name,
			companyPhone: company.phone,
			companyEmail: company.email,
		},
		validate: validateCompany,
		onSubmit: (settingsValues: any) => {
			const { companyName, companyEmail, companyPhone } = settingsValues;
			setIsLoading(true);

			api.post(`company`, {
				name: companyName,
				phone: companyPhone,
				email: companyEmail,
			})
				.then(() => {
					setIsLoading(false);
					setCompany({ name: companyName, email: companyEmail, phone: companyPhone });
					enqueueSnackbar('Success! Updated company', {
						variant: 'success',
					});
				})
				.catch((err) => {
					console.error(err);
					setIsLoading(false);
					enqueueSnackbar('An error has occured, please try again', {
						variant: 'error',
					});
				});
		},
	});

	return (
		<Paper elevation={15} sx={{ maxWidth: 500, minWidth: 300, margin: 'auto' }}>
			<FormCard title={'Settings'}>
				{user.role !== 'Admin' && (
					<Typography sx={{ color: 'red' }}>
						Only admin are able to update the settings.
					</Typography>
				)}
				<form onSubmit={handleSubmit}>
					<Box sx={{ mt: 2 }}>
						<TextField
							sx={{ width: '90%' }}
							variant="outlined"
							type="text"
							name="companyName"
							label="Company Name"
							value={values.companyName}
							onChange={handleChange}
							onBlur={handleBlur}
							error={
								touched.companyName &&
								errors.companyName !== undefined &&
								errors.companyName !== ''
							}
							helperText={touched.companyName ? errors.companyName : ''}
							disabled={user.role !== 'Admin'}
						/>
					</Box>
					<Box sx={{ mt: 2 }}>
						<TextField
							sx={{ width: '90%' }}
							variant="outlined"
							type="text"
							name="companyPhone"
							label="Phone #"
							value={values.companyPhone}
							onChange={handleChange}
							onBlur={handleBlur}
							error={
								touched.companyPhone &&
								errors.companyPhone !== undefined &&
								errors.companyPhone !== ''
							}
							helperText={touched.companyPhone ? errors.companyPhone : ''}
							disabled={user.role !== 'Admin'}
						/>
					</Box>
					<Box sx={{ mt: 2 }}>
						<TextField
							sx={{ width: '90%' }}
							variant="outlined"
							type="text"
							name="companyEmail"
							label="Email"
							value={values.companyEmail}
							onChange={handleChange}
							onBlur={handleBlur}
							error={
								touched.companyEmail &&
								errors.companyEmail !== undefined &&
								errors.companyEmail !== ''
							}
							helperText={touched.companyEmail ? errors.companyEmail : ''}
							disabled={user.role !== 'Admin'}
						/>
					</Box>
					<Box sx={{ mt: 3 }}>
						{isLoading ? (
							<CircularProgress />
						) : (
							<Fab
								color="primary"
								aria-label={'Update Company'}
								type="submit"
								disabled={user.role === 'Manager'}
							>
								<UpdateIcon fontSize="large" />
							</Fab>
						)}
					</Box>
				</form>
			</FormCard>
		</Paper>
	);
};

export default SettingsView;
