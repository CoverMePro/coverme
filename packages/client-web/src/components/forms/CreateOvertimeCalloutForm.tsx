import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import { Box, TextField, CircularProgress, Autocomplete, Fab } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/Add';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import FormCard from './FormCard';
import { formatDateTimeOutputString } from 'utils/formatters/dateTime-formatter';
import api from 'utils/api';
import { IOvertime, IStaff, ITeam } from 'coverme-shared';
import DurationCustom from 'components/number-formats/DurationCustom';
import { getEndDate } from 'utils/helpers/dateTime-helpers';
import { validateOvertimeCallout } from 'utils/validations/overtimeCallout';

interface ICreateOvertimeCalloutFormProps {
	onFinish: (overtimeCallout: IOvertime | undefined) => void;
}

const date = new Date();
date.setHours(12, 0, 0, 0);

const CreateOvertimeCalloutForm: React.FC<ICreateOvertimeCalloutFormProps> = ({ onFinish }) => {
	const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [staff, setStaff] = useState<IStaff[]>([]);
	const [excludedStaff, setExcludedStaff] = useState<string[]>([]);
	const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
	const [dateTimeValue, setDateTimeValue] = useState<Date>();
	const { enqueueSnackbar } = useSnackbar();

	const handleTeamChange = (_: React.SyntheticEvent<Element, Event>, value: ITeam | null) => {
		setSelectedTeam(value);
		setValues({ ...values, selectedTeam: value!.id });
	};

	const handleDateValueChange = (date: any, keyboardInputValue?: string | undefined) => {
		if (date === null) return;
		console.log(date);
		console.log(date.toString());
		setDateTimeValue(date);
		setValues({ ...values, dateTimeValue: date.toString() });
	};

	const handleChangeExcludedStaff = (
		_: React.SyntheticEvent<Element, Event>,
		value: IStaff[] | null
	) => {
		const staffIds = value?.map((s) => s.id);
		console.log(staffIds);
		setExcludedStaff(staffIds ? [...staffIds] : []);
	};

	const { handleSubmit, handleChange, handleBlur, setValues, values, touched, errors } =
		useFormik({
			initialValues: {
				selectedTeam: '',
				excludedStaff: '',
				dateTimeValue: date.toString(),
				duration: '',
			},
			validate: validateOvertimeCallout,
			onSubmit: (userValues: any) => {
				const { selectedTeam, duration } = userValues;
				setIsLoading(true);

				const endDate = getEndDate(dateTimeValue!, duration);
				const shiftString = formatDateTimeOutputString(dateTimeValue!, endDate);

				console.log(shiftString);

				if (selectedTeam) {
					const overtimeCallout: IOvertime = {
						shiftInfo: shiftString,
						team: selectedTeam,
						callouts: [],
						phase: 'Internal',
						status: 'Pending',
						managerNumbers: [],
						allNotifed: false,
						alldeclined: false,
						archive: false,
						exclude: excludedStaff,
					};

					console.log(overtimeCallout);

					setIsLoading(true);
					api.postCreateData<IOvertime>(`overtime-callouts`, overtimeCallout)
						.then((overtime) => {
							enqueueSnackbar('overtime callout created and started.', {
								variant: 'success',
							});
							onFinish(overtime);
						})
						.catch((err) => {
							if (err.response?.status === 403) {
								enqueueSnackbar('A callout for this shift has already been made', {
									variant: 'error',
								});
							} else {
								console.error(err);
								enqueueSnackbar('An error has occured, please try again', {
									variant: 'error',
								});
							}
							onFinish(undefined);
						})
						.finally(() => {
							setIsLoading(false);
						});
				} else {
					enqueueSnackbar('A valid shift was not selected', {
						variant: 'error',
					});
				}
			},
		});

	useEffect(() => {
		// get unassigned shifts
		setIsLoadingData(true);

		api.getAllData<IStaff>(`staff`)
			.then((retreivedStaff) => {
				setStaff(retreivedStaff);
			})
			.catch((err) => {
				console.error(err);
			});

		api.getAllData<ITeam>(`teams`)
			.then((retreivedTeams) => {
				setTeams(retreivedTeams);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				setIsLoadingData(false);
			});
	}, []);

	return (
		<FormCard title="Shift Information">
			<form onSubmit={handleSubmit}>
				{isLoadingData ? (
					<Box>
						<CircularProgress />
					</Box>
				) : (
					<>
						<Box sx={{ mt: 2 }}>
							<Autocomplete
								options={teams}
								getOptionLabel={(option) => `${option.id}`}
								renderOption={(props, option, { selected }) => (
									<li {...props}>{option.id}</li>
								)}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Select Team"
										name="selectedTeam"
										value={values.selectedTeam}
										error={
											touched.selectedTeam &&
											errors.selectedTeam !== undefined &&
											errors.selectedTeam !== ''
										}
										helperText={touched.selectedTeam ? errors.selectedTeam : ''}
									/>
								)}
								onChange={handleTeamChange}
								onBlur={handleBlur}
							/>
						</Box>
						<Box sx={{ mt: 2 }}>
							<Autocomplete
								multiple={true}
								options={staff}
								getOptionLabel={(option) =>
									`${option.firstName} ${option.lastName}`
								}
								renderOption={(props, option, { selected }) => (
									<li {...props}>
										{option.firstName} {option.lastName}
									</li>
								)}
								renderInput={(params) => (
									<TextField {...params} label="Exclude Staff" />
								)}
								onChange={handleChangeExcludedStaff}
							/>
						</Box>
						<Box sx={{ mt: 2 }}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DateTimePicker
									disablePast
									label="Start Date Time"
									value={values.dateTimeValue}
									onChange={handleDateValueChange}
									renderInput={(params) => (
										<TextField
											{...params}
											name="dateTimeValue"
											onBlur={handleBlur}
											onChange={handleChange}
											error={
												touched.dateTimeValue &&
												errors.dateTimeValue !== undefined &&
												errors.dateTimeValue !== ''
											}
											helperText={
												touched.dateTimeValue ? errors.dateTimeValue : ''
											}
										/>
									)}
								/>
							</LocalizationProvider>
						</Box>
						<Box sx={{ mt: 2 }}>
							<TextField
								sx={{ width: '25%' }}
								label="Duration"
								name="duration"
								id="formatted-numberformat-input"
								onChange={handleChange}
								onBlur={handleBlur}
								InputProps={{
									inputComponent: DurationCustom as any,
								}}
								variant="outlined"
								error={
									touched.duration &&
									errors.duration !== undefined &&
									errors.duration !== ''
								}
								helperText={touched.duration ? errors.duration : ''}
							/>
						</Box>

						<Box sx={{ mt: 3 }}>
							{isLoading ? (
								<CircularProgress />
							) : (
								<Fab color="primary" aria-label="Register User" type="submit">
									<HowToRegIcon fontSize="large" />
								</Fab>
							)}
						</Box>
					</>
				)}
			</form>
		</FormCard>
	);
};

export default CreateOvertimeCalloutForm;
