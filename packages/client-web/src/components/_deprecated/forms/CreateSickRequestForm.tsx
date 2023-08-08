// import React, { useState, useEffect } from 'react';
// import { useTypedSelector } from 'hooks/use-typed-selector';
// import { useSnackbar } from 'notistack';
// import { Box, Typography, CircularProgress, Fab, Autocomplete, TextField } from '@mui/material';
// import HowToRegIcon from '@mui/icons-material/Add';

// import FormCard from './FormCard';
// import { formatDateTimeOutputString } from 'utils/formatters/dateTime-formatter';
// import { getTodayAndTomorrowDates } from 'utils/helpers/dateTime-helpers';
// import api from 'utils/api';

// import { IShift, ISickRequest } from 'coverme-shared';

// interface ICreateSickRequestFromProps {
// 	onFinish: (tradeRequest: ISickRequest | undefined) => void;
// }

// const CreateSickRequestForm: React.FC<ICreateSickRequestFromProps> = ({ onFinish }) => {
// 	const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
// 	const [isLoading, setIsLoading] = useState<boolean>(false);
// 	const [selectedShiftId, setSelectedShiftId] = useState<string | undefined>(undefined);
// 	const [userShifts, setUserShifts] = useState<IShift[]>([]);

// 	const [error, setError] = useState<string | undefined>(undefined);

// 	const user = useTypedSelector((state) => state.user);

// 	const { enqueueSnackbar } = useSnackbar();

// 	const handleSubmit = () => {
// 		if (selectedShiftId) {
// 			const sickRequest: ISickRequest = {
// 				requestDate: new Date(),
// 				userId: user.id,
// 				user: `${user.firstName} ${user.lastName}`,
// 				shiftId: selectedShiftId,
// 				status: 'Pending',
// 			};

// 			setIsLoading(true);
// 			setError(undefined);
// 			api.postCreateData<ISickRequest>(`sick-requests`, {
// 				sickRequest,
// 				managers: user.reportTo
// 			})
// 				.then((addedSickRequest) => {
// 					enqueueSnackbar('Sick request submitted.', {
// 						variant: 'success',
// 					});
// 					onFinish(addedSickRequest);
// 				})
// 				.catch((err) => {
// 					if (err.response?.status === 403) {
// 						setError('A sick request for this shift has already been made');
// 					} else {
// 						console.error(err);
// 						enqueueSnackbar('An error has occured, please try again', {
// 							variant: 'error',
// 						});
// 						onFinish(undefined);
// 					}
// 				})
// 				.finally(() => {
// 					setIsLoading(false);
// 				});
// 		} else {
// 			setError('A valid shift was not selected');
// 		}
// 	};

// 	const handleShiftChange = (_: React.SyntheticEvent<Element, Event>, value: IShift | null) => {
// 		if (value) {
// 			setSelectedShiftId(value.id);
// 		} else {
// 			setSelectedShiftId(undefined);
// 		}
// 	};

// 	useEffect(() => {
// 		setIsLoadingData(true);
// 		const dates = getTodayAndTomorrowDates();

// 		api.postGetAllData<IShift>(`shifts/${user.id!}/range`, {
// 			startRange: dates.today,
// 			endRange: dates.tomorrow,
// 		})
// 			.then((shiftResults) => {
// 				setUserShifts(shiftResults);
// 			})
// 			.catch((err) => {
// 				console.error(err);
// 			})
// 			.finally(() => {
// 				setIsLoadingData(false);
// 			});
// 	}, [user.id]);

// 	return (
// 		<FormCard title="Request Sick Leave">
// 			<>
// 				{isLoadingData ? (
// 					<Box>
// 						<CircularProgress />
// 					</Box>
// 				) : (
// 					<>
// 						{userShifts.length > 0 ? (
// 							<>
// 								<Box sx={{ mt: 2 }}>
// 									{error && (
// 										<Box sx={{ my: 1 }}>
// 											<Typography sx={{ color: 'red' }} variant="body1">
// 												{error}
// 											</Typography>
// 										</Box>
// 									)}

// 									<Autocomplete
// 										options={userShifts}
// 										getOptionLabel={(option) =>
// 											`${formatDateTimeOutputString(
// 												option.startDateTime as string,
// 												option.endDateTime as string
// 											)}`
// 										}
// 										renderOption={(props, option, { selected }) => (
// 											<li {...props}>
// 												{formatDateTimeOutputString(
// 													option.startDateTime as string,
// 													option.endDateTime as string
// 												)}
// 											</li>
// 										)}
// 										renderInput={(params) => (
// 											<TextField {...params} label="Shift to take off" />
// 										)}
// 										onChange={handleShiftChange}
// 									/>
// 								</Box>
// 								<Box sx={{ mt: 3 }}>
// 									{isLoading ? (
// 										<CircularProgress />
// 									) : (
// 										<Fab
// 											color="primary"
// 											aria-label="Register User"
// 											onClick={handleSubmit}
// 										>
// 											<HowToRegIcon fontSize="large" />
// 										</Fab>
// 									)}
// 								</Box>
// 							</>
// 						) : (
// 							<Box sx={{ mt: 2 }}>
// 								<Typography variant="h4">
// 									There are no shifts available for a sick request
// 								</Typography>
// 							</Box>
// 						)}
// 					</>
// 				)}
// 			</>
// 		</FormCard>
// 	);
// };

// export default CreateSickRequestForm;
export {};
