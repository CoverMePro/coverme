import React, { useState } from 'react';
import { Box, TextField, CircularProgress, Fab, Paper } from '@mui/material';
import FormCard from 'components/forms/FormCard';
import { useFormik } from 'formik';
import UpdateIcon from '@mui/icons-material/ArrowCircleUpRounded';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useActions } from 'hooks/use-actions';
import api from 'utils/api';
import { validateCompany } from 'utils/validations/company';
import { useSnackbar } from 'notistack';
import { ICompany } from 'coverme-shared';

const SettingsView: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();
	const company = useTypedSelector((state) => state.company);
	const { setCompany } = useActions();
	let updatedCompany: ICompany;

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
				companyName: companyName,
				companyPhone: companyPhone,
				companyEmail: companyEmail,
			})
				.then(() => {
					setIsLoading(false);
					// updatedCompany.name = companyName;
					// updatedCompany.phone = companyPhone;
					// updatedCompany.email = companyEmail;
					//setCompany(updatedCompany);
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
				<form onSubmit={handleSubmit}>
					<Box sx={{ mt: 2 }}>
						<TextField
							sx={{ width: '100%' }}
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
						/>
					</Box>
					<Box sx={{ mt: 2 }}>
						<TextField
							sx={{ width: '100%' }}
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
						/>
					</Box>
					<Box sx={{ mt: 2 }}>
						<TextField
							sx={{ width: '100%' }}
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
						/>
					</Box>
					<Box sx={{ mt: 3 }}>
						{isLoading ? (
							<CircularProgress />
						) : (
							<Fab color="primary" aria-label={'Update Company'} type="submit">
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
