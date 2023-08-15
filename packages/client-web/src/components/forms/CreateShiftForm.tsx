import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import { Box, TextField, Fab, CircularProgress } from '@mui/material';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers';
import FormCard from './FormCard';
import DurationCustom from 'components/number-formats/DurationCustom';
import { validateShift } from 'utils/validations/shift';
import { formatDuration } from 'utils/formatters/dateTime-formatter';
import api from 'utils/api';
import { IShiftTemplate } from 'coverme-shared';

interface ICreateShiftFormProps {
	onAddComplete(shiftDef: IShiftTemplate): void;
}

// TODO: Add to a util
const date = new Date();
date.setHours(12, 0, 0, 0);

const CreateShiftForm: React.FC<ICreateShiftFormProps> = ({ onAddComplete }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [timeValue, setTimeValue] = useState<Date>(date);

	const { enqueueSnackbar } = useSnackbar();

	const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
		initialValues: {
			shiftName: '',
			shiftDuration: '',
		},
		validate: validateShift,
		onSubmit: (shiftValues: any) => {
			setIsLoading(true);
			const { shiftName, shiftDuration } = shiftValues;

			const shiftTemplate: IShiftTemplate = {
				name: shiftName,
				startTimeHours: timeValue.getHours(),
				startTimeMinutes: timeValue.getMinutes(),
				duration: formatDuration(shiftDuration),
			};

			api.postCreateData<IShiftTemplate>(`shift-templates`, shiftTemplate)
				.then((addedShiftTemplate) => {
					enqueueSnackbar('Shift template created!', {
						variant: 'success',
						autoHideDuration: 3000,
					});

					onAddComplete(addedShiftTemplate);
				})
				.catch((err) => {
					console.error(err);
					enqueueSnackbar(
						'An unknow error occured, please try again or contact support.',
						{ variant: 'error', autoHideDuration: 5000 }
					);
				})
				.finally(() => {
					setIsLoading(false);
				});
		},
	});

	return (
		<FormCard title="Create a Shift Template">
			<form onSubmit={handleSubmit}>
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
					<TextField
						sx={{ width: '50%' }}
						variant="outlined"
						type="text"
						name="shiftName"
						label="Shift Name"
						onChange={handleChange}
						onBlur={handleBlur}
						error={
							touched.shiftName &&
							errors.shiftName !== undefined &&
							errors.shiftName !== ''
						}
						helperText={touched.shiftName ? errors.shiftName : ''}
					/>
				</Box>
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<TimePicker
							label="Start Time"
							value={timeValue}
							onChange={(newValue) => {
								if (newValue) {
									console.log(newValue);
									setTimeValue(newValue);
								}
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
					</LocalizationProvider>
				</Box>
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
					<TextField
						sx={{ width: '50%' }}
						label="Duration"
						onChange={handleChange}
						name="shiftDuration"
						id="formatted-numberformat-input"
						InputProps={{
							inputComponent: DurationCustom as any,
						}}
						onBlur={handleBlur}
						error={
							touched.shiftDuration &&
							errors.shiftDuration !== undefined &&
							errors.shiftDuration !== ''
						}
						helperText={touched.shiftDuration ? errors.shiftDuration : ''}
						variant="outlined"
					/>
				</Box>

				<Box sx={{ mt: 3 }}>
					{isLoading ? (
						<CircularProgress />
					) : (
						<Fab color="primary" type="submit">
							<MoreTimeIcon fontSize="large" />
						</Fab>
					)}
				</Box>
			</form>
		</FormCard>
	);
};

export default CreateShiftForm;
