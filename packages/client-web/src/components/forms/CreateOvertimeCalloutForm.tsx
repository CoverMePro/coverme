import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Box, TextField, CircularProgress, Autocomplete, Fab } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/Add';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';

import FormCard from './FormCard';
import { formatDateTimeOutputString2 } from 'utils/formatters/dateTime-formatter';
import api from 'utils/api';

import { IOvertime, ITeam } from 'coverme-shared';

import DurationCustom from 'components/number-formats/DurationCustom';
import { getEndDate } from 'utils/helpers/dateTime-helpers';

interface ICreateOvertimeCalloutFormProps {
	onFinish: (overtimeCallout: IOvertime | undefined) => void;
}

interface IShiftInfo {
	id: string;
	team: string;
	dateString: string;
}

const date = new Date();
date.setHours(12, 0, 0, 0);

const CreateOvertimeCalloutForm: React.FC<ICreateOvertimeCalloutFormProps> = ({ onFinish }) => {
	const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);

	const [duration, setDuration] = useState<string>('');
	const [dateTimeValue, setDateTimeValue] = useState<Date>(date);

	const { enqueueSnackbar } = useSnackbar();

	const handleTeamChange = (_: React.SyntheticEvent<Element, Event>, value: ITeam | null) => {
		setSelectedTeam(value);
	};

	const handleDurationChange = (event: any) => {
		setDuration(event.target.value);
	};

	const handleSubmit = () => {
		// TO DO: Handle when a shift already has a callout? - NEEDS TO TEST
		const endDate = getEndDate(dateTimeValue, duration);

		const shiftString = formatDateTimeOutputString2(dateTimeValue, endDate);

		console.log(shiftString);

		if (selectedTeam) {
			const overtimeCallout: IOvertime = {
				shiftInfo: shiftString,
				team: selectedTeam.id,
				callouts: [],
				phase: 'Internal',
				status: 'Pending',
				managerNumbers: [],
				allNotifed: false,
				alldeclined: false,
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
	};

	useEffect(() => {
		// get unassigned shifts
		setIsLoadingData(true);

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
			<>
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
									<TextField {...params} label="Select Team" />
								)}
								onChange={handleTeamChange}
							/>
						</Box>
						<Box sx={{ mt: 2 }}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DateTimePicker
									disablePast
									label="Start Date Time"
									value={dateTimeValue}
									onChange={(newValue) => {
										if (newValue) {
											setDateTimeValue(newValue);
										}
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
						</Box>
						<Box sx={{ mt: 2 }}>
							<TextField
								sx={{ width: '25%' }}
								label="Duration"
								value={duration}
								onChange={handleDurationChange}
								name="shiftDuration"
								id="formatted-numberformat-input"
								InputProps={{
									inputComponent: DurationCustom as any,
								}}
								variant="outlined"
							/>
						</Box>
						<Box sx={{ mt: 3 }}>
							{isLoading ? (
								<CircularProgress />
							) : (
								<Fab
									color="primary"
									aria-label="Register User"
									onClick={handleSubmit}
								>
									<HowToRegIcon fontSize="large" />
								</Fab>
							)}
						</Box>
					</>
				)}
			</>
		</FormCard>
	);
};

export default CreateOvertimeCalloutForm;
