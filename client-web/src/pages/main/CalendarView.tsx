import React, { useEffect, useCallback, useState } from 'react';

import { useTypedSelector } from 'hooks/use-typed-selector';

import FullCalendar, { EventApi, EventInput } from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick

import axios from 'utils/axios-intance';
import { AxiosResponse } from 'axios';
import { IShift } from 'models/Shift';
import { ITimeOff } from 'models/TimeOff';
import LinearLoading from 'components/loading/LineraLoading';
import { Box } from '@mui/material';

const CalendarView: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [events, setEvents] = useState<EventInput[]>([]);

    const user = useTypedSelector((state) => state.user);

    const formatEvents = (shifts: IShift[], timeOff: ITimeOff[]) => {
        console.log(timeOff);
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
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/company/${user.company!}/shifts`)
            .then((result: AxiosResponse) => {
                console.log(result.data.teamStaff);
                formatEvents(result.data.shifts, result.data.timeOff);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user.company]);

    useEffect(() => {
        getShiftsFromTeams();
    }, [getShiftsFromTeams]);

    return (
        <>
            {isLoading ? (
                <>
                    <LinearLoading />
                </>
            ) : (
                <FullCalendar
                    timeZone="UTC"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridDay,timeGridWeek,dayGridMonth',
                    }}
                    schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                    eventDrop={(e) => console.log(e)}
                    height="100%"
                    events={events}
                    contentHeight="100%"
                    dayMaxEvents={true}
                    navLinks={true}
                />
            )}
        </>
    );
};

export default CalendarView;
