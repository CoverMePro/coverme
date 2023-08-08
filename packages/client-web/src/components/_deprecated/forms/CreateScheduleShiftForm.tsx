// import React, { useState } from 'react';
// import { useSnackbar } from 'notistack';
// import { useFormik } from 'formik';
// import { useTypedSelector } from 'hooks/use-typed-selector';
// import {
// 	Box,
// 	FormControl,
// 	InputLabel,
// 	Typography,
// 	Select,
// 	MenuItem,
// 	FormHelperText,
// 	Fab,
// 	Button,
// 	CircularProgress,
// } from '@mui/material';
// import HowToRegIcon from '@mui/icons-material/Add';
// import FormCard from '../../forms/FormCard';
// import ShiftCreator from 'components/shared/ShiftCreator';
// import RotationCreator from 'components/shared/RotationCreator';
// import { validateCreateScheduleShift } from 'utils/validations/createShift';
// import api from 'utils/api';

// import {
// 	IScheduleShiftCell,
// 	IShiftTransaction,
// 	IShiftTemplate,
// 	IShiftRotation,
// 	IShiftRotationTransaction,
// } from 'coverme-shared';

// interface ICreateScheduleShiftFormProps {
// 	staff: any[];
// 	shiftTemplates: IShiftTemplate[];
// 	rotations: IShiftRotation[];
// 	onCompleteAdd: () => void;
// }

// const CreateScheduleShiftForm: React.FC<ICreateScheduleShiftFormProps> = ({
// 	staff,
// 	rotations,
// 	shiftTemplates,
// 	onCompleteAdd,
// }) => {
// 	const [scheduledShifts, setScheduledShifts] = useState<IScheduleShiftCell[]>([]);
// 	const [scheduledRotations, setScheduledRotations] = useState<IScheduleShiftCell[]>([]);
// 	const [transactions, setTransactions] = useState<IShiftTransaction[]>([]);
// 	const [rotationTransactions, setRotationTransactions] = useState<IShiftRotationTransaction[]>(
// 		[]
// 	);
// 	const [isLoading, setIsLoading] = useState<boolean>(false);

// 	const user = useTypedSelector((state) => state.user);
// 	const { enqueueSnackbar } = useSnackbar();

// 	// TODO: Make validation better
// 	const { handleSubmit, handleChange, values, handleBlur, touched, errors } = useFormik({
// 		initialValues: {
// 			selectedUser: '',
// 			selectedTeam: '',
// 		},
// 		validate: validateCreateScheduleShift,
// 		onSubmit: (shiftValues: any) => {
// 			// axios.post
// 			setIsLoading(true);
// 			api.post(`shift-transactions`, {
// 				transactions: transactions,
// 				rotationTransactions: rotationTransactions,
// 			})
// 				.then(() => {
// 					enqueueSnackbar('Shifts have been added to the schedule', {
// 						variant: 'success',
// 					});
// 					setTransactions([]);
// 					setIsLoading(false);
// 					onCompleteAdd();
// 				})
// 				.catch((error) => {
// 					console.error(error);
// 					setIsLoading(false);
// 					enqueueSnackbar('An error has occured, please try again.', {
// 						variant: 'error',
// 					});
// 				});
// 		},
// 	});

// 	const handleSelectChange = (event: any) => {
// 		setScheduledShifts([]);
// 		setTransactions([]);
// 		handleChange(event);
// 	};

// 	const getUsersFromTeam = () => {
// 		const users = staff.filter((user: any) => {
// 			return user.teams.findIndex((t: string) => t === values.selectedTeam) !== -1;
// 		});

// 		return users;
// 	};

// 	const handleAddScheduleShift = () => {
// 		// TO DO: Better Id generation
// 		const scheduleShift: IScheduleShiftCell = {
// 			id: Math.random() * 10000,
// 		};

// 		setScheduledShifts([...scheduledShifts, scheduleShift]);
// 	};

// 	const handleDeleteShift = (id: number) => {
// 		const newTransaction = transactions.filter(
// 			(transaction) => transaction.id !== id.toString()
// 		);

// 		const newScheduleShifts = scheduledShifts.filter(
// 			(scheduledShift) => scheduledShift.id !== id
// 		);

// 		setTransactions(newTransaction);
// 		setScheduledShifts(newScheduleShifts);
// 	};

// 	const handleAddScheduleRotation = () => {
// 		// TO DO: Better Id generation
// 		const scheduleRotation: IScheduleShiftCell = {
// 			id: Math.random() * 10000,
// 		};

// 		setScheduledRotations([...scheduledRotations, scheduleRotation]);
// 	};

// 	const handleDeleteRotation = (id: number) => {
// 		const newRotationTransaction = rotationTransactions.filter(
// 			(transaction) => transaction.id !== id.toString()
// 		);

// 		const newScheduleRotation = scheduledRotations.filter(
// 			(scheduledRotation) => scheduledRotation.id !== id
// 		);

// 		setRotationTransactions(newRotationTransaction);
// 		setScheduledRotations(newScheduleRotation);
// 	};

// 	const handleCancelScheduleShift = (id: number) => {
// 		const newScheduleShifts = scheduledShifts.filter((schedule) => schedule.id !== id);
// 		setScheduledShifts(newScheduleShifts);
// 	};

// 	const handleCancelRotation = (id: number) => {
// 		const newRotations = scheduledRotations.filter((schedule) => schedule.id !== id);
// 		setScheduledRotations(newRotations);
// 	};

// 	const handleConfirmScheduleShift = (shiftTransaction: IShiftTransaction) => {
// 		const selectedStaff = staff.find((user) => user.userId === values.selectedUser);

// 		if (selectedStaff) {
// 			const updatedTransaction: IShiftTransaction = {
// 				...shiftTransaction,
// 				// TO DO: Better Id generation

// 				teamId: values.selectedTeam,
// 				userId: selectedStaff.userId,
// 				userName: selectedStaff.userName,
// 			};

// 			const newTransactions = [...transactions, updatedTransaction];

// 			setTransactions(newTransactions);
// 		}
// 	};

// 	const handleConfirmScheduleRotation = (rotationTransaction: IShiftRotationTransaction) => {
// 		const selectedStaff = staff.find((user) => user.userId === values.selectedUser);

// 		if (selectedStaff) {
// 			const updatedTransaction: IShiftRotationTransaction = {
// 				...rotationTransaction,
// 				// TO DO: Better Id generation

// 				userName: selectedStaff.userName,
// 				teamId: values.selectedTeam,
// 				userId: selectedStaff.userId,
// 			};

// 			const newTransactions = [...rotationTransactions, updatedTransaction];

// 			setRotationTransactions(newTransactions);
// 		}
// 	};

// 	const isCreateDisabled = () => {
// 		let isDisabled = false;

// 		if (
// 			(transactions.length === 0 && rotationTransactions.length === 0) ||
// 			!values.selectedTeam ||
// 			!values.selectedUser
// 		) {
// 			isDisabled = true;
// 		}

// 		return isDisabled;
// 	};

// 	return (
// 		<FormCard title="Create a Shift" s={700} md={1000}>
// 			<form onSubmit={handleSubmit}>
// 				<Box sx={{ mt: 2 }}>
// 					<FormControl fullWidth>
// 						<InputLabel>Team</InputLabel>
// 						<Select
// 							fullWidth
// 							name="selectedTeam"
// 							value={values.selectedTeam}
// 							label="Type"
// 							placeholder="select user for shift"
// 							onChange={handleSelectChange}
// 							onBlur={handleBlur}
// 							error={
// 								touched.selectedTeam &&
// 								errors.selectedTeam !== undefined &&
// 								errors.selectedTeam !== ''
// 							}
// 						>
// 							{user.teams.map((team: string) => {
// 								return (
// 									<MenuItem key={team} value={team}>
// 										{team}
// 									</MenuItem>
// 								);
// 							})}
// 						</Select>
// 						<FormHelperText color="error">
// 							{touched.selectedTeam ? errors.selectedTeam : ''}
// 						</FormHelperText>
// 					</FormControl>
// 				</Box>
// 				<Box sx={{ mt: 2 }}>
// 					<FormControl fullWidth>
// 						<InputLabel>User</InputLabel>
// 						<Select
// 							fullWidth
// 							name="selectedUser"
// 							value={values.selectedUser}
// 							label="Type"
// 							placeholder="select user for shift"
// 							onChange={handleSelectChange}
// 							onBlur={handleBlur}
// 							error={
// 								touched.selectedUser &&
// 								errors.selectedUser !== undefined &&
// 								errors.selectedUser !== ''
// 							}
// 						>
// 							{getUsersFromTeam().map((user: any) => {
// 								return (
// 									<MenuItem key={user.userId} value={user.userId}>
// 										{user.userName}
// 									</MenuItem>
// 								);
// 							})}
// 						</Select>
// 						<FormHelperText color="error">
// 							{touched.selectedUser ? errors.selectedUser : ''}
// 						</FormHelperText>
// 					</FormControl>
// 				</Box>
// 				<Box sx={{ mt: 2 }}>
// 					<Typography variant="h3">Shifts</Typography>
// 					{scheduledShifts.map((schedule) => {
// 						return (
// 							<ShiftCreator
// 								key={schedule.id}
// 								shifts={shiftTemplates}
// 								onCancel={() => handleCancelScheduleShift(schedule.id)}
// 								onDelete={() => handleDeleteShift(schedule.id)}
// 								onConfirm={handleConfirmScheduleShift}
// 								shiftScheduleId={schedule.id}
// 							/>
// 						);
// 					})}
// 				</Box>
// 				<Box sx={{ mt: 2 }}>
// 					<Typography variant="h3">Rotations</Typography>
// 					{scheduledRotations.map((schedule) => {
// 						return (
// 							<RotationCreator
// 								key={schedule.id}
// 								rotations={rotations}
// 								onCancel={() => handleCancelRotation(schedule.id)}
// 								onDelete={() => handleDeleteRotation(schedule.id)}
// 								onConfirm={handleConfirmScheduleRotation}
// 								rotationScheduleId={schedule.id}
// 							/>
// 						);
// 					})}
// 				</Box>
// 				<Box sx={{ mt: 2 }}>
// 					<Button variant="outlined" fullWidth onClick={handleAddScheduleShift}>
// 						Schedule A Shift
// 					</Button>
// 				</Box>
// 				<Box sx={{ mt: 2 }}>
// 					<Button variant="outlined" fullWidth onClick={handleAddScheduleRotation}>
// 						Schedule A Rotation
// 					</Button>
// 				</Box>

// 				<Box sx={{ mt: 3 }}>
// 					{isLoading ? (
// 						<CircularProgress />
// 					) : (
// 						<Fab color="primary" type="submit" disabled={isCreateDisabled()}>
// 							<HowToRegIcon fontSize="large" />
// 						</Fab>
// 					)}
// 				</Box>
// 			</form>
// 		</FormCard>
// 	);
// };

// export default CreateScheduleShiftForm;

export default {};
