// import 'styles/calendar.css';
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { useSnackbar } from 'notistack';
// import { useTypedSelector } from 'hooks/use-typed-selector';
// import FullCalendar, { EventInput } from '@fullcalendar/react'; // must go before plugins
// import { EventChangeArg, EventInstance } from '@fullcalendar/common';
// import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
// import resourceTimegridPlugin from '@fullcalendar/resource-timegrid'; // a plugin
// import interactionPlugin, { EventDragStopArg } from '@fullcalendar/interaction';
// import { Box, Typography } from '@mui/material';

// import PageLoading from 'components/loading/PageLoading';
// import DataFilter from 'components/shared/DataFilter';
// import EditSchedule from 'components/scheduler/EditSchedule';
// import api from 'utils/api';

// import {
// 	ITimeOff,
// 	IShift,
// 	IShiftTransaction,
// 	IShiftTemplate,
// 	IShiftRotation,
// 	ITeam,
// } from 'coverme-shared';

// // TODO: Refactor and split up code to other files/functions
// const ScheduleView: React.FC = () => {
// 	const [allStaff, setAllStaff] = useState<any[]>([]);
// 	const [teams, setTeams] = useState<ITeam[]>([]);
// 	const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
// 	const [shiftDefs, setShiftDefs] = useState<IShiftTemplate[]>([]);
// 	const [shiftRotations, setShiftRotations] = useState<IShiftRotation[]>([]);
// 	const [events, setEvents] = useState<EventInput[]>([]);
// 	const [shiftTransactions, setShiftTransactions] = useState<IShiftTransaction[]>([]);
// 	const [isLoading, setIsLoading] = useState<boolean>(false);
// 	const [isLoadingConfirm, setIsLoadingConfirm] = useState<boolean>(false);

// 	const [isDragging, setIsDragging] = useState<boolean>(false);

// 	const [filter, setFilter] = useState<string>('teams');

// 	const user = useTypedSelector((state) => state.user);

// 	const calendarRef = useRef<any>(undefined);

// 	const { enqueueSnackbar } = useSnackbar();

// 	// HELPER METHODS
// 	const getTeam = (resourceId: string) => {
// 		let team = '';
// 		if (calendarRef.current) {
// 			let calendarApi = calendarRef.current.getApi();
// 			const resource = calendarApi.getResourceById(resourceId);
// 			team = resource.extendedProps.team;
// 		}

// 		return team;
// 	};

// 	const getUserId = (resourceId: string) => {
// 		let userId = '';
// 		if (calendarRef.current) {
// 			let calendarApi = calendarRef.current.getApi();
// 			const resource = calendarApi.getResourceById(resourceId);
// 			userId =
// 				resource.extendedProps.userId !== '' ? resource.extendedProps.userId : 'unclaimed';
// 		}

// 		return userId;
// 	};

// 	const getUserName = (resourceId: string) => {
// 		let userId = '';
// 		if (calendarRef.current) {
// 			let calendarApi = calendarRef.current.getApi();
// 			const resource = calendarApi.getResourceById(resourceId);
// 			userId =
// 				resource.extendedProps.userName !== ''
// 					? resource.extendedProps.userName
// 					: 'unclaimed';
// 		}

// 		return userId;
// 	};

// 	const removeTransaction = (id: string) => {
// 		const filtedTransactions = shiftTransactions.filter((shift) => shift.instanceId !== id);

// 		setShiftTransactions(filtedTransactions);
// 	};

// 	const changeTransaction = (title: string, eventInstance: EventInstance, resourceId: string) => {
// 		const filtedTransactions = shiftTransactions.filter(
// 			(shift) => shift.instanceId !== eventInstance.instanceId
// 		);

// 		const changedtransaction: IShiftTransaction = {
// 			type: 'add',
// 			name: title,
// 			instanceId: eventInstance.instanceId,
// 			userId: getUserId(resourceId),
// 			userName: getUserName(resourceId),
// 			teamId: getTeam(resourceId),
// 			startDate: eventInstance.range.start,
// 			endDate: eventInstance.range.end,
// 		};

// 		setShiftTransactions([...filtedTransactions, changedtransaction]);
// 	};

// 	const getTeamColor = (teamId: string, teams: ITeam[]) => {
// 		const selectedTeam = teams.find((team) => team.id === teamId);

// 		if (selectedTeam) {
// 			return selectedTeam.color;
// 		}

// 		return '#006d77';
// 	};

// 	const formatEvents = useCallback((shifts: IShift[], timeOff: ITimeOff[], teams: ITeam[]) => {
// 		const formattedShifts = shifts.map((shift) => {
// 			return {
// 				id: shift.id,
// 				title: shift.name,
// 				start: shift.startDateTime,
// 				end: shift.endDateTime,
// 				resourceId: shift.userId,
// 				color: getTeamColor(shift.teamId, teams),
// 			};
// 		});

// 		const formattedTimeOff: any[] = [];

// 		timeOff.forEach((to) => {
// 			formattedTimeOff.push({
// 				id: to.id,
// 				title: to.name,
// 				start: to.startDateTime,
// 				end: to.endDateTime,
// 				resourceId: to.userId,
// 				color: 'red',
// 			});
// 		});

// 		const formattedEvents = [...formattedShifts, ...formattedTimeOff];

// 		setEvents(formattedEvents);
// 	}, []);

// 	const handleDragStart = (arg: any) => {
// 		setIsDragging(true);
// 	};

// 	/**
// 	 * Handler when event dragging has stopped
// 	 * This is primarily for when dragging event into the trash icon (to remove)
// 	 * @param draggedEvent - Information on the event that is being dragged
// 	 */
// 	const handleDragStop = (draggedEvent: EventDragStopArg) => {
// 		let trashEl = document.getElementById('fc-trash')!; //as HTMLElement;

// 		let x1 = trashEl.offsetLeft;
// 		let x2 = trashEl.offsetLeft + trashEl.offsetWidth;
// 		let y1 = trashEl.offsetTop;
// 		let y2 = trashEl.offsetTop + trashEl.offsetHeight;

// 		if (
// 			draggedEvent.jsEvent.pageX >= x1 &&
// 			draggedEvent.jsEvent.pageX <= x2 &&
// 			draggedEvent.jsEvent.pageY >= y1 &&
// 			draggedEvent.jsEvent.pageY <= y2
// 		) {
// 			// check if this is a shift that is in database or not
// 			// if so, add a 'remove' transaction instead of deleting the current 'add' transaction of this instance
// 			if (draggedEvent.event._def.publicId !== '') {
// 				const transaction: IShiftTransaction = {
// 					type: 'remove',
// 					id: draggedEvent.event._def.publicId,
// 				};

// 				const newShiftTransactions = [...shiftTransactions, transaction];

// 				setShiftTransactions(newShiftTransactions);
// 			} else {
// 				removeTransaction(draggedEvent.event._instance!.instanceId);
// 			}

// 			draggedEvent.event.remove();
// 		}

// 		setIsDragging(false);
// 	};

// 	/**
// 	 * Handler for when the event changes in the calendar
// 	 * @param changedEvent - Information on the old and new event
// 	 */
// 	const handleEventChange = (changedEvent: EventChangeArg) => {
// 		// check if this is a shift that is in database or not
// 		// if so, add a 'change' transaction instead of changing the current 'add' transaction of this instance
// 		if (changedEvent.event._instance && changedEvent.event._def.resourceIds) {
// 			if (changedEvent.event._def.publicId !== '') {
// 				const transaction: IShiftTransaction = {
// 					type: 'change',
// 					id: changedEvent.event._def.publicId,
// 					userId: getUserId(changedEvent.event._def.resourceIds[0]),
// 					userName: getUserName(changedEvent.event._def.resourceIds[0]),
// 					teamId: getTeam(changedEvent.event._def.resourceIds[0]),
// 					instanceId: changedEvent.event._instance.instanceId,
// 					startDate: changedEvent.event._instance.range.start,
// 					endDate: changedEvent.event._instance.range.end,
// 				};

// 				const newShiftTransactions = [...shiftTransactions, transaction];

// 				setShiftTransactions(newShiftTransactions);
// 			} else {
// 				changeTransaction(
// 					changedEvent.event._def.title,
// 					changedEvent.event._instance,
// 					changedEvent.event._def.resourceIds[0]
// 				);
// 			}
// 		} else {
// 			console.error('ERROR: unable to find event instance and/or resource ids');
// 		}
// 	};

// 	const isInTeam = (teams: string[], userTeams: string[]) => {
// 		let result = false;
// 		userTeams.forEach((userTeam) => {
// 			const foundTeam = teams.findIndex((t) => t === userTeam) !== -1;

// 			if (foundTeam) {
// 				result = true;
// 			}
// 		});
// 		return result;
// 	};

// 	const formatStaff = useCallback(
// 		(staff: any[], filterValue: string) => {
// 			if (user.role === 'owner') {
// 				return [...staff];
// 			}

// 			if (filterValue === 'teams' && user.teams) {
// 				const filteredStaff = staff.filter((s) => {
// 					return isInTeam(s.teams, user.teams!);
// 				});
// 				return [...filteredStaff];
// 			} else {
// 				return [...staff];
// 			}
// 		},
// 		[user]
// 	);

// 	const handleFilterChange = (filterValue: string) => {
// 		setFilter(filterValue);

// 		setFilteredStaff(formatStaff(allStaff, filterValue));
// 	};

// 	const handleConfirmTransactions = () => {
// 		setIsLoadingConfirm(true);
// 		api.post(`shift-transactions`, {
// 			transactions: shiftTransactions,
// 			rotationTransactions: [],
// 		})
// 			.then(() => {
// 				enqueueSnackbar('Edits to the schedule have been recorded.', {
// 					variant: 'success',
// 				});
// 				setShiftTransactions([]);
// 				getShiftsFromTeams();
// 			})
// 			.catch((error) => {
// 				console.error(error);
// 				enqueueSnackbar('An error has occured, please try again.', { variant: 'error' });
// 			})
// 			.finally(() => {
// 				setIsLoadingConfirm(false);
// 			});
// 	};

// 	const getShiftsFromTeams = useCallback(() => {
// 		setIsLoading(true);
// 		api.getGenericData(`shifts`)
// 			.then((result) => {
// 				setAllStaff([...result.staff]);
// 				setShiftDefs(result.shiftDefs);
// 				setShiftRotations(result.rotations);
// 				setTeams(result.teams);
// 				formatEvents(result.shifts, result.timeOff, result.teams);
// 			})
// 			.catch((error) => {
// 				console.error(error);
// 			})
// 			.finally(() => {
// 				setIsLoading(false);
// 			});
// 	}, [formatEvents]);

// 	useEffect(() => {
// 		setFilteredStaff(formatStaff(allStaff, 'teams'));
// 	}, [allStaff, formatStaff]);

// 	useEffect(() => {
// 		getShiftsFromTeams();
// 	}, [getShiftsFromTeams]);

// 	return (
// 		<Box sx={{ width: '100%', height: '100%' }}>
// 			{isLoading ? (
// 				<PageLoading />
// 			) : (
// 				<>
// 					<Box
// 						sx={{
// 							display: 'flex',
// 							justifyContent: 'space-between',
// 							alignItems: 'center',
// 						}}
// 					>
// 						<Box sx={{ display: 'flex', gap: 2 }}>
// 							<Typography variant="h1">Schedule</Typography>
// 							{user.role !== 'owner' && (
// 								<DataFilter
// 									filterValue={filter}
// 									onFilterChange={handleFilterChange}
// 									extraOptions={[]}
// 								/>
// 							)}
// 						</Box>
// 						<Box
// 							sx={{
// 								display: 'flex',
// 								gap: 2,
// 								flexGrow: 2,
// 								alignItems: 'center',
// 								justifyContent: 'center',
// 							}}
// 						>
// 							{isDragging ? (
// 								<Box
// 									sx={{
// 										border: '2px dashed #006d77',
// 										width: '100%',
// 										height: '75px',
// 										marginLeft: '2rem',
// 										display: 'flex',
// 										alignItems: 'center',
// 										justifyContent: 'center',
// 									}}
// 									id="fc-trash"
// 								>
// 									<Typography variant="h2" color="primary">
// 										Remove
// 									</Typography>
// 								</Box>
// 							) : (
// 								<>
// 									{teams.map((team) => (
// 										<Box key={team.id} sx={{ display: 'flex', gap: 1 }}>
// 											<Typography variant="h5">{team.id}</Typography>
// 											<Box
// 												sx={{
// 													width: '50px',
// 													backgroundColor: `${team.color}`,
// 													borderRadius: '10%',
// 												}}
// 											></Box>
// 										</Box>
// 									))}
// 								</>
// 							)}
// 						</Box>
// 						{user.role !== 'staff' && (
// 							<EditSchedule
// 								staff={allStaff}
// 								shiftDefs={shiftDefs}
// 								rotations={shiftRotations}
// 								isLoadingConfirm={isLoadingConfirm}
// 								hasUpdateTransactions={shiftTransactions.length > 0}
// 								onConfirmUpdateTransactions={handleConfirmTransactions}
// 							/>
// 						)}
// 					</Box>

// 					<div>
// 						<FullCalendar
// 							ref={calendarRef}
// 							timeZone="utc"
// 							plugins={[
// 								resourceTimelinePlugin,
// 								resourceTimegridPlugin,
// 								interactionPlugin,
// 							]}
// 							schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
// 							initialView="resourceTimelineDay"
// 							headerToolbar={{
// 								left: 'prev,next',
// 								center: 'title',
// 								right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
// 							}}
// 							titleFormat={{
// 								year: 'numeric',
// 								month: 'long',
// 								day: 'numeric',
// 								weekday: 'long',
// 							}}
// 							resourceAreaHeaderContent="Staff"
// 							resourceGroupField="employeeType"
// 							resources={filteredStaff}
// 							editable
// 							eventStartEditable
// 							eventColor="#006d77"
// 							eventResizableFromStart
// 							eventDurationEditable
// 							eventResourceEditable
// 							dragRevertDuration={0}
// 							eventDragStart={handleDragStart}
// 							eventDragStop={handleDragStop}
// 							eventChange={handleEventChange}
// 							events={events}
// 							eventDrop={(e) => console.log(e)}
// 							height={'auto'}
// 							contentHeight={'auto'}
// 							nowIndicator={true}
// 						/>
// 					</div>
// 				</>
// 			)}
// 		</Box>
// 	);
// };

// export default ScheduleView;

export default {};
