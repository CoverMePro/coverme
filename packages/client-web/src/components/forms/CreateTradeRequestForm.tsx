import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import {
	Box,
	TextField,
	Fab,
	Autocomplete,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
	FormHelperText,
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/Add';

import FormCard from './FormCard';
import { formatDateTimeOutputString } from 'utils/formatters/dateTime-formatter';
import api from 'utils/api';

import { ITradeRequest, IUser, IShift } from 'coverme-shared';

interface ICreateTradeRequestFromProps {
	onFinish: (tradeRequest: ITradeRequest | undefined) => void;
}

const CreateTradeRequestFrom: React.FC<ICreateTradeRequestFromProps> = ({ onFinish }) => {
	const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [staff, setStaff] = useState<IUser[]>([]);
	const [userShifts, setUserShifts] = useState<IShift[]>([]);
	const [requestedShifts, setRequestedShifts] = useState<IShift[]>([]);
	const [selectedProposedShiftId, setSelectedProposedShiftId] = useState<string>('');
	const [selectedRequestedUser, setSelectedRequestedUserId] = useState<any>(undefined);
	const [selectedRequestedShiftId, setSelectedRequestedShiftId] = useState<string>('');

	//validation useState
	const [validation, setValidation] = useState({
		selectedProposedShiftId: false,
		selectedRequestedUser: false,
		selectedRequestedShiftId: false,
	});

	const user = useTypedSelector((state) => state.user);

	const { enqueueSnackbar } = useSnackbar();

	// TO DO: better form validation using what we have! do more research and figure out how to utilize here

	const handleSubmit = () => {
		if (validCheck() == true) {
			const tradeRequest: ITradeRequest = {
				proposedDate: new Date(),
				proposedUserId: user.id,
				proposedUser: {
					name: `${user.firstName} ${user.lastName}`,
					email: user.email,
				},

				proposedShiftId: selectedProposedShiftId,

				requestedUserId: selectedRequestedUser.id,
				requestedUser: {
					name: selectedRequestedUser.name,
					email: selectedRequestedUser.email,
				},
				requestedShiftId: selectedRequestedShiftId,
				status: 'Pending',
			};

			setIsLoading(true);
			api.postCreateData<ITradeRequest>(`trade-request`, tradeRequest)
				.then((addedTradeRequest) => {
					enqueueSnackbar('Trade request submitted.', {
						variant: 'success',
					});
					onFinish(addedTradeRequest);
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
			return true;
		} else return false;
	};

	const validCheck = () => {
		let errors = { ...validation };

		if (
			selectedProposedShiftId === '' ||
			selectedRequestedShiftId === '' ||
			selectedRequestedUser === '' ||
			selectedRequestedUser === undefined
		) {
			if (selectedProposedShiftId === '') {
				errors.selectedProposedShiftId = true;
			}
			if (selectedRequestedShiftId === '') {
				errors.selectedRequestedShiftId = true;
			}
			if (selectedRequestedUser === '' || selectedRequestedUser === undefined) {
				errors.selectedRequestedUser = true;
			}
			setValidation(errors);
			return false;
		} else return true;
	};

	const handlePropsedShiftChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
		let errors = { ...validation };
		if (event.target.value == '') {
			errors.selectedProposedShiftId = true;
		} else {
			errors.selectedProposedShiftId = false;
		}
		setValidation(errors);
		setSelectedProposedShiftId(event.target.value);
	};

	const handleRequestedUserChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: IUser | null
	) => {
		let errors = { ...validation };

		if (value) {
			errors.selectedRequestedUser = false;
			setValidation(errors);

			setSelectedRequestedUserId({
				id: value.id,
				name: `${value.firstName} ${value.lastName}`,
				email: value.email,
			});
			// get shifts

			api.getAllData<IShift>(`shifts/${value.id}/today`)
				.then((shifts) => {
					setRequestedShifts(shifts);
				})
				.catch((err) => {
					console.error(err);
				})
				.finally();
		} else if (value !== '') {
			errors.selectedRequestedUser = true;
			setValidation(errors);
		} else {
			errors.selectedRequestedUser = true;
			setValidation(errors);
			setSelectedRequestedUserId(undefined);
		}
		return setValidation(errors);
	};

	const handleRequestedShiftChange = (
		event: SelectChangeEvent<string>,
		child: React.ReactNode
	) => {
		let errors = { ...validation };
		if (event.target.value == '') {
			errors.selectedRequestedShiftId = true;
		} else {
			errors.selectedRequestedShiftId = false;
		}
		setValidation(errors);
		setSelectedRequestedShiftId(event.target.value);
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoadingData(true);

				const getStaffPromise = api.getAllData<IUser>(`users`);
				const getShiftsPromise = api.getAllData<IShift>(`shifts/${user.id!}/today`);

				const [users, shifts] = await Promise.all([getStaffPromise, getShiftsPromise]);

				const staffUsers: IUser[] = users.filter(
					(staffUser: IUser) => staffUser.role === 'staff' && staffUser.id !== user.id
				);
				setStaff(staffUsers);
				setUserShifts(shifts);
				setIsLoadingData(false);
			} catch (err) {
				console.error(err);
				setIsLoadingData(false);
			}
		};

		loadData();
	}, [user.id]);

	return (
		<FormCard title="Trade Request">
			<>
				{isLoadingData ? (
					<Box>
						<CircularProgress />
					</Box>
				) : (
					<>
						<Box>
							<FormControl fullWidth error={validation.selectedProposedShiftId}>
								<InputLabel id="proposed-shift-label">
									Your Shift To Trade
								</InputLabel>
								<Select
									labelId="proposed-shift-label"
									id="proposed-shift-select"
									value={selectedProposedShiftId}
									label="Your Shift To Trade"
									onChange={handlePropsedShiftChange}
								>
									{userShifts.map((shift) => {
										return (
											<MenuItem key={shift.id} value={shift.id}>
												{formatDateTimeOutputString(
													shift.startDateTime as string,
													shift.endDateTime as string
												)}
											</MenuItem>
										);
									})}
								</Select>
								<FormHelperText error={validation.selectedProposedShiftId}>
									{validation.selectedProposedShiftId ? 'Required' : ''}
								</FormHelperText>
							</FormControl>
						</Box>
						<Box sx={{ mt: 2 }}>
							<FormControl fullWidth>
								<Autocomplete
									options={staff}
									getOptionLabel={(option) =>
										`${option.firstName} ${option.lastName} - ${option.email}`
									}
									renderOption={(props, option, { selected }) => (
										<li {...props}>
											{option.firstName} {option.lastName} - {option.email}
										</li>
									)}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Staff to Trade With"
											name="requestedUserId"
											error={validation.selectedRequestedUser}
											helperText={
												validation.selectedRequestedUser ? 'Required' : ''
											}
										/>
									)}
									onChange={handleRequestedUserChange}
								/>
							</FormControl>
						</Box>
						<Box sx={{ mt: 2 }}>
							<FormControl fullWidth error={validation.selectedRequestedShiftId}>
								<InputLabel id="requested-shift-label">Requested Shift</InputLabel>
								<Select
									labelId="requested-shift-label"
									id="requested-shift-select"
									value={selectedRequestedShiftId}
									label="Requested Shift"
									onChange={handleRequestedShiftChange}
								>
									{requestedShifts.map((shift) => {
										return (
											<MenuItem key={shift.id} value={shift.id}>
												{formatDateTimeOutputString(
													shift.startDateTime as string,
													shift.endDateTime as string
												)}
											</MenuItem>
										);
									})}
								</Select>
								<FormHelperText error={validation.selectedRequestedShiftId}>
									{validation.selectedRequestedShiftId ? 'Required' : ''}
								</FormHelperText>
							</FormControl>
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

export default CreateTradeRequestFrom;
