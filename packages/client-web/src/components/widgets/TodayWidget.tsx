import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar, { EventInput } from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Paper } from '@mui/material';

import PageLoading from 'components/loading/PageLoading';
import { IShift, ITimeOff } from 'coverme-shared';

import api from 'utils/api';

const TodayWidget: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [events, setEvents] = useState<EventInput[]>([]);

	const formatEvents = (shifts: IShift[], timeOff: ITimeOff[]) => {
		// TODO: do not show unclaimed
		const formattedShifts = shifts.map((shift) => {
			if (shift.userId === '') return {};
			return {
				id: shift.id,
				title: `${shift.name} (${shift.userId !== '' ? shift.userId : 'unclaimed'})`,
				start: shift.startDateTime,
				end: shift.endDateTime,
				resourceId: `${shift.teamId}-${shift.userId}`,
				color: '#006d77',
			};
		});

		const formattedTimeOff: any[] = [];

		timeOff.forEach((to) => {
			to.teams.forEach((team) => {
				formattedTimeOff.push({
					id: to.id,
					title: to.name,
					start: to.startDateTime,
					end: to.endDateTime,
					resourceId: `${team}-${to.userId}`,
					color: 'red',
				});
			});
		});

		const formattedEvents = [...formattedShifts, ...formattedTimeOff];

		setEvents(formattedEvents);
	};

	const getShiftsFromTeams = useCallback(() => {
		setIsLoading(true);
		api.getGenericData(`shifts`)
			.then((result) => {
				formatEvents(result.data.shifts, result.data.timeOff);
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		getShiftsFromTeams();
	}, [getShiftsFromTeams]);

	return (
		<Paper sx={{ height: '100%', p: 2 }}>
			{isLoading ? (
				<>
					<PageLoading />
				</>
			) : (
				<FullCalendar
					timeZone="UTC"
					plugins={[timeGridPlugin]}
					initialView="timeGridDay"
					schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
					eventDrop={(e) => console.log(e)}
					height="100%"
					events={events}
					contentHeight="100%"
					dayMaxEvents={true}
				/>
			)}
		</Paper>
	);
};

export default TodayWidget;
