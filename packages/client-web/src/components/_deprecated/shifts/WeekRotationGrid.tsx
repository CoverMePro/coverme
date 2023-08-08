// import React from 'react';
// import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
// import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
// import ClearIcon from '@mui/icons-material/Clear';
// import DeleteIcon from '@mui/icons-material/Delete';

// import { formatAMPM, formatDurationClean } from 'utils/formatters/dateTime-formatter';

// import { IShiftRotation } from 'coverme-shared';

// interface IWeekRotationGridProps {
// 	rotationDetails: IShiftRotation;
// 	onDelete: () => void;
// }

// const WeekRotationGrid: React.FC<IWeekRotationGridProps> = ({ rotationDetails, onDelete }) => {
// 	return (
// 		<>
// 			<Grid container columns={7} spacing={2}>
// 				<Grid item xs={1}>
// 					<Box
// 						sx={{
// 							display: 'flex',
// 							flexDirection: 'column',
// 							alignItems: 'center',
// 							gap: 2,
// 						}}
// 					>
// 						<Typography variant="h3">Monday</Typography>
// 						{'monday' in rotationDetails.shifts && rotationDetails.shifts.monday ? (
// 							<>
// 								<AccessTimeFilledIcon color="primary" />
// 								<Typography>
// 									{formatAMPM(
// 										rotationDetails.shifts.monday.timeHour,
// 										rotationDetails.shifts.monday.timeMinute
// 									)}
// 								</Typography>
// 								<Typography>
// 									{formatDurationClean(rotationDetails.shifts.monday.duration)}
// 								</Typography>
// 							</>
// 						) : (
// 							<ClearIcon color="primary" />
// 						)}
// 					</Box>
// 				</Grid>
// 				<Grid item xs={1}>
// 					<Box
// 						sx={{
// 							display: 'flex',
// 							flexDirection: 'column',
// 							alignItems: 'center',
// 							gap: 2,
// 						}}
// 					>
// 						<Typography variant="h3">Tuesday</Typography>
// 						{'tuesday' in rotationDetails.shifts && rotationDetails.shifts.tuesday ? (
// 							<>
// 								<AccessTimeFilledIcon color="primary" />
// 								<Typography>
// 									{formatAMPM(
// 										rotationDetails.shifts.tuesday.timeHour,
// 										rotationDetails.shifts.tuesday.timeMinute
// 									)}
// 								</Typography>
// 								<Typography>
// 									{formatDurationClean(rotationDetails.shifts.tuesday.duration)}
// 								</Typography>
// 							</>
// 						) : (
// 							<ClearIcon color="primary" />
// 						)}
// 					</Box>
// 				</Grid>
// 				<Grid item xs={1}>
// 					<Box
// 						sx={{
// 							display: 'flex',
// 							flexDirection: 'column',
// 							alignItems: 'center',
// 							gap: 2,
// 						}}
// 					>
// 						<Typography variant="h3">Wednesday</Typography>
// 						{'wednesday' in rotationDetails.shifts &&
// 						rotationDetails.shifts.wednesday ? (
// 							<>
// 								<AccessTimeFilledIcon color="primary" />
// 								<Typography>
// 									{formatAMPM(
// 										rotationDetails.shifts.wednesday.timeHour,
// 										rotationDetails.shifts.wednesday.timeMinute
// 									)}
// 								</Typography>
// 								<Typography>
// 									{formatDurationClean(rotationDetails.shifts.wednesday.duration)}
// 								</Typography>
// 							</>
// 						) : (
// 							<ClearIcon color="primary" />
// 						)}
// 					</Box>
// 				</Grid>
// 				<Grid item xs={1}>
// 					<Box
// 						sx={{
// 							display: 'flex',
// 							flexDirection: 'column',
// 							alignItems: 'center',
// 							gap: 2,
// 						}}
// 					>
// 						<Typography variant="h3">Thursday</Typography>
// 						{'thursday' in rotationDetails.shifts && rotationDetails.shifts.thursday ? (
// 							<>
// 								<AccessTimeFilledIcon color="primary" />
// 								<Typography>
// 									{formatAMPM(
// 										rotationDetails.shifts.thursday.timeHour,
// 										rotationDetails.shifts.thursday.timeMinute
// 									)}
// 								</Typography>
// 								<Typography>
// 									{formatDurationClean(rotationDetails.shifts.thursday.duration)}
// 								</Typography>
// 							</>
// 						) : (
// 							<ClearIcon color="primary" />
// 						)}
// 					</Box>
// 				</Grid>
// 				<Grid item xs={1}>
// 					<Box
// 						sx={{
// 							display: 'flex',
// 							flexDirection: 'column',
// 							alignItems: 'center',
// 							gap: 2,
// 						}}
// 					>
// 						<Typography variant="h3">Friday</Typography>
// 						{'friday' in rotationDetails.shifts && rotationDetails.shifts.friday ? (
// 							<>
// 								<AccessTimeFilledIcon color="primary" />
// 								<Typography>
// 									{formatAMPM(
// 										rotationDetails.shifts.friday.timeHour,
// 										rotationDetails.shifts.friday.timeMinute
// 									)}
// 								</Typography>
// 								<Typography>
// 									{formatDurationClean(rotationDetails.shifts.friday.duration)}
// 								</Typography>
// 							</>
// 						) : (
// 							<ClearIcon color="primary" />
// 						)}
// 					</Box>
// 				</Grid>
// 				<Grid item xs={1}>
// 					<Box
// 						sx={{
// 							display: 'flex',
// 							flexDirection: 'column',
// 							alignItems: 'center',
// 							gap: 2,
// 						}}
// 					>
// 						<Typography variant="h3">Saturday</Typography>
// 						{'saturday' in rotationDetails.shifts && rotationDetails.shifts.saturday ? (
// 							<>
// 								<AccessTimeFilledIcon color="primary" />
// 								<Typography>
// 									{formatAMPM(
// 										rotationDetails.shifts.saturday.timeHour,
// 										rotationDetails.shifts.saturday.timeMinute
// 									)}
// 								</Typography>
// 								<Typography>
// 									{formatDurationClean(rotationDetails.shifts.saturday.duration)}
// 								</Typography>
// 							</>
// 						) : (
// 							<ClearIcon color="primary" />
// 						)}
// 					</Box>
// 				</Grid>
// 				<Grid item xs={1}>
// 					<Box
// 						sx={{
// 							display: 'flex',
// 							flexDirection: 'column',
// 							alignItems: 'center',
// 							gap: 2,
// 						}}
// 					>
// 						<Typography variant="h3">Sunday</Typography>
// 						{'sunday' in rotationDetails.shifts && rotationDetails.shifts.sunday ? (
// 							<>
// 								<AccessTimeFilledIcon color="primary" />
// 								<Typography>
// 									{formatAMPM(
// 										rotationDetails.shifts.sunday.timeHour,
// 										rotationDetails.shifts.sunday.timeMinute
// 									)}
// 								</Typography>
// 								<Typography>
// 									{formatDurationClean(rotationDetails.shifts.sunday.duration)}
// 								</Typography>
// 							</>
// 						) : (
// 							<ClearIcon color="primary" />
// 						)}
// 					</Box>
// 				</Grid>
// 			</Grid>

// 			<Tooltip title="Delete Rotation ">
// 				<IconButton size="large" onClick={onDelete}>
// 					<DeleteIcon color="primary" fontSize="large" />
// 				</IconButton>
// 			</Tooltip>
// 		</>
// 	);
// };

// export default WeekRotationGrid;

export {};
