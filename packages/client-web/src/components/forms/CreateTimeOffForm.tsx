import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import React, { useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import {
	Box,
	CircularProgress,
	Fab,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
	RadioGroup,
	FormControlLabel,
	Radio,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRange, Range } from 'react-date-range';
import { TimePicker } from '@mui/x-date-pickers';
import HowToRegIcon from '@mui/icons-material/Add';
import FormCard from './FormCard';
import api from 'utils/api';

import { ITimeOffRequest, TimeOffType } from 'coverme-shared';

interface ICreateTimeOffFormProps {
	onFinish: (tradeRequest: ITimeOffRequest | undefined) => void;
}

const CreateTimeOffForm: React.FC<ICreateTimeOffFormProps> = ({ onFinish }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [startDateTime, setStartDateTime] = useState<Date>(new Date());
	const [endDateTime, setEndDateTime] = useState<Date>(new Date());
	const [timeOffType, setTimeOffType] = useState<TimeOffType>('Vacation');
	const [description, setDescription] = useState<string>('');

	const [partialDate, setPartialDate] = useState<Date>(new Date());

	const [dateRange, setDateRange] = useState<Range[]>([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection',
		},
	]);

	const [dayType, setDayType] = useState<'partial' | 'full'>('full');

	const user = useTypedSelector((state) => state.user);

	const { enqueueSnackbar } = useSnackbar();

	const handleTypeChange = (event: SelectChangeEvent<TimeOffType>, child: React.ReactNode) => {
		setTimeOffType(event.target.value as TimeOffType);
	};

	const handleDescriptionChange = (event: any) => {
		setDescription(event.target.value);
	};

	const handleDayTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const changedDayType = (event.target as HTMLInputElement).value as 'partial' | 'full';

		setDayType(changedDayType);
	};

	const formatPartialDate = (partialDayDate: Date, partialTimeDate: Date) => {
		const formattedDate = new Date(partialDayDate);
		formattedDate.setUTCHours(partialTimeDate.getHours(), partialTimeDate.getMinutes(), 0, 0);

		return formattedDate;
	};

	const formatFullDate = (fullDayDate: Date, isStart: boolean) => {
		const formattedDate = new Date(fullDayDate);

		if (isStart) {
			formattedDate.setUTCHours(0, 0, 0, 0);
		} else {
			formattedDate.setUTCHours(24, 0, 0, 0);
		}

		return formattedDate;
	};

	// TO DO: better form validation using what we have! do more research and figure out how to utilize here
	// TO DO: better date picker for here?
	const handleSubmit = () => {
		const timeOffRequest: ITimeOffRequest = {
			requestDate: new Date(),
			type: timeOffType,
			timeOffStart:
				dayType === 'full'
					? formatFullDate(dateRange[0].startDate!, true)
					: formatPartialDate(partialDate, startDateTime),
			timeOffEnd:
				dayType === 'full'
					? formatFullDate(dateRange[0].endDate!, false)
					: formatPartialDate(partialDate, endDateTime),
			userId: user.id,
			user: `${user.firstName} ${user.lastName}`,
			teams: user.teams,
			status: 'Pending',
		};

		setIsLoading(true);
		api.postCreateData<ITimeOffRequest>(`$time-off`, timeOffRequest)
			.then((addedTimeOffRequest) => {
				enqueueSnackbar('Time off submitted.', {
					variant: 'success',
				});
				onFinish(addedTimeOffRequest);
			})
			.catch((err) => {
				console.error(err);
				enqueueSnackbar('An error has occured, please try again', {
					variant: 'error',
				});
				onFinish(undefined);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<FormCard title="Request Time Off">
			<FormControl>
				<RadioGroup row value={dayType} onChange={handleDayTypeChange}>
					<FormControlLabel value="partial" control={<Radio />} label="Partial Day" />
					<FormControlLabel value="full" control={<Radio />} label="Full Day" />
				</RadioGroup>
			</FormControl>
			<Box sx={{ mt: 2 }}>
				<FormControl>
					<InputLabel>Type</InputLabel>
					<Select value={timeOffType} label="Type" onChange={handleTypeChange}>
						<MenuItem value={'Vacation'}>Vacation</MenuItem>
						<MenuItem value={'Lieu'}>Lieu</MenuItem>
						<MenuItem value={'Floater'}>Floater</MenuItem>
						<MenuItem value={'Other'}>Other</MenuItem>
					</Select>
				</FormControl>
			</Box>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				{dayType === 'full' && (
					<>
						<Box sx={{ mt: 2 }}>
							<DateRange
								editableDateInputs={true}
								onChange={(item) => setDateRange([item.selection])}
								moveRangeOnFirstSelection={false}
								ranges={dateRange}
								rangeColors={['#006d77']}
							/>
						</Box>
					</>
				)}
				{dayType === 'partial' && (
					<>
						<Box sx={{ mt: 2 }}>
							<DatePicker
								disablePast
								renderInput={(props) => <TextField {...props} fullWidth />}
								label="Time Off Start"
								value={startDateTime}
								onChange={(newValue) => {
									if (newValue) {
										setPartialDate(newValue);
									}
								}}
							/>
						</Box>
						<Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
							<TimePicker
								label="Start Time"
								value={startDateTime}
								onChange={(newValue) => {
									if (newValue) {
										setStartDateTime(newValue);
									}
								}}
								renderInput={(params) => <TextField {...params} />}
							/>
							<TimePicker
								label="End Time"
								value={endDateTime}
								onChange={(newValue) => {
									if (newValue) {
										setEndDateTime(newValue);
									}
								}}
								renderInput={(params) => <TextField {...params} />}
							/>
						</Box>
					</>
				)}
			</LocalizationProvider>

			<Box sx={{ mt: 2 }}>
				<TextField
					fullWidth
					label="Description"
					multiline
					maxRows={4}
					value={description}
					onChange={handleDescriptionChange}
				/>
			</Box>
			<Box sx={{ mt: 3 }}>
				{isLoading ? (
					<CircularProgress />
				) : (
					<Fab color="primary" aria-label="Register User" onClick={handleSubmit}>
						<HowToRegIcon fontSize="large" />
					</Fab>
				)}
			</Box>
		</FormCard>
	);
};

export default CreateTimeOffForm;
