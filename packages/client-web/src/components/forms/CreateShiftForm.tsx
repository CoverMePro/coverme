import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import { Box, TextField, Fab, CircularProgress, duration } from '@mui/material';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import UpdateIcon from '@mui/icons-material/ArrowCircleUpRounded';
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
	editMode: boolean;
	selectedTemplate: any;
	onAddComplete(shiftDef: IShiftTemplate): void;
	onFinish: (shiftTemplate: IShiftTemplate) => void;
	selectedTimes: any;
}

// TODO: Add to a util
const date = new Date();
const CreateShiftForm: React.FC<ICreateShiftFormProps> = ({
	onAddComplete,
	editMode,
	selectedTemplate,
	selectedTimes,
	onFinish,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	if (editMode) {
		date.setHours(selectedTimes.startTimeHours);
		date.setMinutes(selectedTimes.startTimeMinutes);
	} else date.setHours(12, 0, 0, 0);

	const [timeValue, setTimeValue] = useState<Date>(date);

	const { enqueueSnackbar } = useSnackbar();

	const { handleSubmit, handleChange, handleBlur, values, touched, errors } = useFormik({
		initialValues: {
			shiftName: editMode ? selectedTemplate.name : '',
			shiftDuration: editMode ? selectedTimes.duration.replace(':', '') : '',
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
			if (editMode) {
				api.postGetData(`shift-templates/${selectedTimes.id}`, {
					name: shiftName,
					startTimeHours: timeValue.getHours(),
					startTimeMinutes: timeValue.getMinutes(),
					duration: shiftTemplate.duration,
				})
					.then((result) => {
						setIsLoading(false);
						enqueueSnackbar('Success! Shift Template has been updated', {
							variant: 'success',
							autoHideDuration: 3000,
						});
						onFinish(result.updatedShiftTemplate);
					})
					.catch((err) => {
						console.error(err);
						setIsLoading(false);
						enqueueSnackbar('An error has occured, please try again', {
							variant: 'error',
						});
					});
			} else {
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
			}
		},
	});

	return (
		<FormCard title={editMode ? 'Edit Shift template' : 'Create a Shift Template'}>
			<form onSubmit={handleSubmit}>
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
					<TextField
						sx={{ width: '50%' }}
						variant="outlined"
						type="text"
						name="shiftName"
						label="Shift Name"
						value={values.shiftName}
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
						value={values.shiftDuration}
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
							{editMode ? (
								<UpdateIcon fontSize="large" />
							) : (
								<MoreTimeIcon fontSize="large" />
							)}
						</Fab>
					)}
				</Box>
			</form>
		</FormCard>
	);
};

export default CreateShiftForm;
