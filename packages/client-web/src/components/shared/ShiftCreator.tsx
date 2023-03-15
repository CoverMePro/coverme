import { Box } from '@mui/system';
import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import {
	FormControl,
	InputLabel,
	TextField,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import DurationCustom from 'components/number-formats/DurationCustom';
import { formatAMPM, formatDurationClean } from 'utils/formatters/dateTime-formatter';
import { getEndDate } from 'utils/helpers/dateTime-helpers';

import { IShiftTemplate, IShiftTransaction } from 'coverme-shared';
import { Transaction } from 'firebase/firestore';

// TODO: Utils it
const date = new Date();
date.setHours(12, 0, 0, 0);

interface IShiftCreatorProps {
	shifts: IShiftTemplate[];
	onCancel: () => void;
	onConfirm: (shiftTransaction: IShiftTransaction) => void;
	onDelete: (shiftTransaction: IShiftTransaction) => void;
}

const ShiftCreator: React.FC<IShiftCreatorProps> = ({ shifts, onCancel, onConfirm, onDelete }) => {
	const [editMode, setEditMode] = useState<boolean>(true);
	const [manualInput, setManualInput] = useState<boolean>(false);

	const [startDate, setStartDate] = useState<Date>(date);

	const [selectedShiftTemplateId, setSelectedShiftTemplateId] = useState<string>('');
	const [duration, setDuration] = useState<string>('');
	const [dateTimeValue, setDateTimeValue] = useState<Date>(date);

	const [shiftName, setShiftName] = useState<string>('');

	const [display, setDisplay] = useState<string>('');

	const handleToggleManualInput = () => {
		const newManualInput = !manualInput;
		setManualInput(newManualInput);
	};

	const handleDurationChange = (event: any) => {
		setDuration(event.target.value);
	};

	const handleNameChange = (event: any) => {
		setShiftName(event.target.value);
	};

	const handleShiftTemplateChange = (event: SelectChangeEvent) => {
		const shiftTemplateId = event.target.value as string;

		setSelectedShiftTemplateId(shiftTemplateId);
	};

	const handleDisplay = (date: Date, duration: string) => {
		setDisplay(
			`${date.toDateString()} - ${formatAMPM(
				date.getHours(),
				date.getMinutes()
			)} - ${formatDurationClean(duration)}`
		);
	};

	const handleConfirm = () => {
		let shiftTransaction: IShiftTransaction;

		if (manualInput) {
			shiftTransaction = {
				type: 'add',
				name: shiftName,
				startDate: dateTimeValue,
				endDate: getEndDate(dateTimeValue, duration),
			};

			onConfirm(shiftTransaction);
			handleDisplay(dateTimeValue, duration);
			setEditMode(false);
		} else {
			const selectedShiftTemplate = shifts.find(
				(shift) => shift.id === selectedShiftTemplateId
			);

			if (selectedShiftTemplate) {
				const newStartDate = new Date(startDate);

				newStartDate.setHours(
					selectedShiftTemplate.startTimeHours,
					selectedShiftTemplate.startTimeMinutes
				);

				shiftTransaction = {
					type: 'add',
					name: selectedShiftTemplate.name,
					startDate: newStartDate,
					endDate: getEndDate(startDate, selectedShiftTemplate.duration),
				};

				console.log(newStartDate);

				onConfirm(shiftTransaction);
				handleDisplay(newStartDate, selectedShiftTemplate.duration);
				setEditMode(false);
			}
		}
	};

	const handleDelete = () => {
		let shiftTransaction: IShiftTransaction;

		if (manualInput) {
			shiftTransaction = {
				type: 'remove',
				name: shiftName,
				startDate: dateTimeValue,
				endDate: getEndDate(dateTimeValue, duration),
			};

			onDelete(shiftTransaction);
			setDisplay('');
			//setEditMode(false);
		} else {
			const selectedShiftTemplate = shifts.find(
				(shift) => shift.id === selectedShiftTemplateId
			);

			if (selectedShiftTemplate) {
				const newStartDate = new Date(startDate);

				newStartDate.setHours(
					selectedShiftTemplate.startTimeHours,
					selectedShiftTemplate.startTimeMinutes
				);

				shiftTransaction = {
					type: 'remove',
					name: selectedShiftTemplate.name,
					startDate: newStartDate,
					endDate: getEndDate(startDate, selectedShiftTemplate.duration),
				};

				onDelete(shiftTransaction);
				setDisplay('');
				setEditMode(false);
			}
		}
	};

	const handleCancel = () => {
		if (display === '') {
			onCancel();
		} else {
			setEditMode(false);
		}
	};

	const isConfirmDisabled = () => {
		let isDisabled = false;

		if (!manualInput) {
			if (shifts.length === 0 || selectedShiftTemplateId == '') {
				isDisabled = true;
			}
		} else {
			if (duration === '' || duration.length !== 4 || shiftName === '') {
				isDisabled = true;
			}
		}

		return isDisabled;
	};

	return (
		<>
			{editMode ? (
				<Box sx={{ flexGrow: 1 }}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							gap: 1,
						}}
					>
						{manualInput ? (
							<>
								<TextField
									sx={{ width: '25%' }}
									label="Name"
									value={shiftName}
									onChange={handleNameChange}
									name="shiftName"
									variant="outlined"
								/>

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
							</>
						) : (
							<>
								{shifts.length > 0 ? (
									<>
										<Box sx={{ flexGrow: 2, width: '50%' }}>
											<LocalizationProvider dateAdapter={AdapterDateFns}>
												<DatePicker
													disablePast
													label="Start Date"
													value={startDate}
													onChange={(newValue) => {
														if (newValue) {
															setStartDate(newValue);
														}
													}}
													renderInput={(params) => (
														<TextField {...params} />
													)}
												/>
											</LocalizationProvider>
										</Box>
										<FormControl fullWidth sx={{ flexGrow: 1 }}>
											<InputLabel id="shift-template-label">
												Shift Template
											</InputLabel>
											<Select
												labelId="shift-template-label"
												value={selectedShiftTemplateId}
												label="Shift Template"
												onChange={handleShiftTemplateChange}
											>
												{shifts.map((shift) => (
													<MenuItem key={shift.id} value={shift.id}>
														{shift.name}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</>
								) : (
									<>
										<Box sx={{ flexGrow: 1 }}>
											<Typography variant="h4">
												You do not have any Shift Templates
											</Typography>
											<Typography>
												Please create a template or switch to manual input
											</Typography>
										</Box>
									</>
								)}
							</>
						)}

						<Box sx={{ display: 'flex', gap: 1 }}>
							<Tooltip title="Confirm">
								<IconButton
									size="large"
									onClick={handleConfirm}
									disabled={isConfirmDisabled()}
								>
									<CheckCircleIcon
										color={isConfirmDisabled() ? 'disabled' : 'primary'}
										fontSize="large"
									/>
								</IconButton>
							</Tooltip>
							<Tooltip title={manualInput ? 'Shift Template' : 'Manual Input'}>
								<IconButton size="large" onClick={handleToggleManualInput}>
									{manualInput ? (
										<AutoStoriesIcon color="primary" fontSize="large" />
									) : (
										<DesignServicesIcon color="primary" fontSize="large" />
									)}
								</IconButton>
							</Tooltip>
							<Tooltip title="Cancel">
								<IconButton size="large" onClick={handleCancel}>
									<CancelIcon color="primary" fontSize="large" />
								</IconButton>
							</Tooltip>
						</Box>
					</Box>
				</Box>
			) : (
				display != '' && (
					<Box>
						<Box sx={{ flexGrow: 1 }}>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									gap: 1,
								}}
							>
								<Box
									sx={{
										display: 'flex',
										gap: 2,
										justifyContent: 'center',
										flexGrow: 1,
									}}
								>
									<Typography variant="h3">{display}</Typography>
								</Box>
								<Box sx={{ display: 'flex', gap: 2 }}>
									<Tooltip title="Edit Shift ">
										<IconButton size="large" onClick={() => setEditMode(true)}>
											<EditIcon color="primary" fontSize="large" />
										</IconButton>
									</Tooltip>

									<Tooltip title="Delete Shift ">
										<IconButton
											size="large"
											onClick={() => {
												handleDelete();
											}}
										>
											<DeleteIcon color="primary" fontSize="large" />
										</IconButton>
									</Tooltip>
								</Box>
							</Box>
						</Box>
					</Box>
				)
			)}
		</>
	);
};

export default ShiftCreator;
