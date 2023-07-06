import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import { Box, TextField, CircularProgress, Autocomplete, Fab } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/Add';

import FormCard from './FormCard';
import { formatDateTimeOutputString } from 'utils/formatters/dateTime-formatter';
import api from 'utils/api';

import { IShift, IOvertime } from 'coverme-shared';

interface ICreateOvertimeCalloutFormProps {
	onFinish: (overtimeCallout: IOvertime | undefined) => void;
}

interface IShiftInfo {
	id: string;
	team: string;
	dateString: string;
}

const CreateOvertimeCalloutForm: React.FC<ICreateOvertimeCalloutFormProps> = ({ onFinish }) => {
	const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [unassignedShifts, setUnassignedShifts] = useState<IShift[]>([]);
	const [selectedShift, setSelectedShift] = useState<IShiftInfo | undefined>(undefined);

	const user = useTypedSelector((state) => state.user);

	const { enqueueSnackbar } = useSnackbar();

	const handleShiftChange = (_: React.SyntheticEvent<Element, Event>, value: IShift | null) => {
		if (value) {
			setSelectedShift({
				id: value.id,
				team: value.teamId,
				dateString: formatDateTimeOutputString(
					value.startDateTime as string,
					value.endDateTime as string
				),
			});
		} else {
			setSelectedShift(undefined);
		}
	};

	const handleSubmit = () => {
		// TO DO: Handle when a shift already has a callout? - NEEDS TO TEST
		if (selectedShift) {
			const overtimeCallout: IOvertime = {
				company: '',
				shiftId: selectedShift.id,
				shiftInfo: selectedShift.dateString,
				team: selectedShift.team,
				callouts: [],
				phase: 'Internal',
				status: 'Pending',
				managerNumbers: [],
				allNotifed: false,
				alldeclined: false,
			};

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

		const unclaimedUser = 'unclaimed';

		api.getAllData<IShift>(`shifts/${unclaimedUser}/today`)
			.then((shifts) => {
				setUnassignedShifts(shifts);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				setIsLoadingData(false);
			});
	}, []);

	return (
		<FormCard title="Overtime Callout">
			<>
				{isLoadingData ? (
					<Box>
						<CircularProgress />
					</Box>
				) : (
					<>
						<Box sx={{ mt: 2 }}>
							<Autocomplete
								options={unassignedShifts}
								getOptionLabel={(option) =>
									`${formatDateTimeOutputString(
										option.startDateTime as string,
										option.endDateTime as string
									)}`
								}
								renderOption={(props, option, { selected }) => (
									<li {...props}>
										{formatDateTimeOutputString(
											option.startDateTime as string,
											option.endDateTime as string
										)}
									</li>
								)}
								renderInput={(params) => (
									<TextField {...params} label="Select Unclaimed Shift" />
								)}
								onChange={handleShiftChange}
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
